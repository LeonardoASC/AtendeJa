<?php

namespace App\Services\OneDoc;

use App\Models\Solicitacao;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OneDocProtocolService
{
    public function __construct(
        private OneDocClient $client
    ) {}

    /**
     * Descobre se esta solicitação deve abrir algum protocolo e qual config usar.
     */
    public function resolveProtocolKeyForSolicitacao(Solicitacao $solicitacao): ?string
    {
        foreach (config('onedoc.protocolos', []) as $key => $cfg) {
            if (!($cfg['enabled'] ?? false)) {
                continue;
            }

            $tipoId = (int) ($cfg['tipo_atendimento_id'] ?? 0);
            if ($tipoId > 0 && (int) $solicitacao->tipo_atendimento_id === $tipoId) {
                return $key;
            }
        }

        return null;
    }

    /**
     * Abre protocolo no 1Doc usando multipart/form-data no padrão do Swagger.
     */
    public function openProtocolFromSolicitacao(Solicitacao $solicitacao): array
    {
        Log::info('=== INÍCIO ABERTURA PROTOCOLO ONEDOC ===', [
            'solicitacao_id' => $solicitacao->id,
            'tipo_atendimento_id' => $solicitacao->tipo_atendimento_id,
        ]);

        $protocolKey = $this->resolveProtocolKeyForSolicitacao($solicitacao);

        if (!$protocolKey) {
            Log::warning('Protocolo SKIPPED - Nenhuma config encontrada');
            return [
                'skipped' => true,
                'reason' => 'Nenhuma configuração de protocolo encontrada para esse tipo_atendimento_id.',
            ];
        }

        Log::info('Protocol key resolvido', ['protocol_key' => $protocolKey]);

        $cfg = config("onedoc.protocolos.$protocolKey");

        $destinoIdSetor = (int) ($cfg['destino_id_setor'] ?? 0);
        $idAssunto = (int) ($cfg['id_assunto'] ?? 0);

        if ($destinoIdSetor <= 0 || $idAssunto <= 0) {
            throw new \RuntimeException("Config do 1Doc incompleta para [$protocolKey]. Verifique destino_id_setor e id_assunto.");
        }

        Log::info('Configuração validada', [
            'destino_id_setor' => $destinoIdSetor,
            'id_assunto' => $idAssunto,
        ]);

        $now = now();


        $conteudo = $this->buildConteudo($solicitacao);

        $campos = $cfg['campos'] ?? [];
        if (!is_array($campos)) {
            $campos = [];
        }

        $anexos = $this->buildAnexos($solicitacao);

        Log::info('Anexos construídos', [
            'count' => count($anexos),
            'anexos' => $anexos,
        ]);

        $fields = [
            'solicitante[nome]' => $solicitacao->nome,
            'solicitante[email]' => $solicitacao->email ?? '',
            'solicitante[cpf_cnpj]' => preg_replace('/\D+/', '', (string) $solicitacao->cpf),
            'solicitante[tipo_pessoa]' => 'f',

            'data' => $now->toDateString(),
            'hora' => $now->format('H:i:s'),

            'destino_id_setor' => $destinoIdSetor,
            'id_integracao' => (string) $solicitacao->id,
            'id_assunto' => $idAssunto,

            'conteudo' => $conteudo,
        ];

        foreach (array_values($campos) as $i => $campo) {
            $fields["campos[$i][campo]"] = (string) ($campo['campo'] ?? '');
            $fields["campos[$i][valor]"] = (string) ($campo['valor'] ?? '');
        }

        foreach (array_values($anexos) as $i => $anexo) {
            $fields["anexos[$i][arquivo]"] = (string) ($anexo['arquivo'] ?? '');
            $fields["anexos[$i][tipo]"] = (string) ($anexo['tipo'] ?? '');
            $fields["anexos[$i][url_original]"] = (string) ($anexo['url_original'] ?? '');
        }

        Log::info('OneDoc payload (multipart fields) pronto', [
            'protocol_key' => $protocolKey,
            'fields' => $fields,
        ]);

        Log::info('>>> CHAMANDO API ONEDOC <<<');

        try {
            $response = $this->client->postMultipart('/protocolos', $fields);

            Log::info('=== SUCESSO: Protocolo criado ===', [
                'response' => $response,
            ]);
        } catch (\Exception $e) {
            Log::error('=== ERRO: Falha ao criar protocolo ===', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }

        $data = $response['data'] ?? [];

        $solicitacao->onedoc_hash = $data['hash'] ?? null;
        $solicitacao->onedoc_id_emissao = $data['id_emissao'] ?? null;
        $solicitacao->onedoc_codigo = $data['codigo'] ?? null;

        if (!empty($data['num']) && !empty($data['ano'])) {
            $solicitacao->onedoc_numero = $data['num'] . '/' . $data['ano'];
        }

        $solicitacao->onedoc_status = 'aberto';
        $solicitacao->onedoc_payload = $fields;
        $solicitacao->onedoc_response = $response;
        $solicitacao->onedoc_error = null;
        $solicitacao->onedoc_opened_at = now();
        $solicitacao->save();

        return $response;
    }

    private function buildConteudo(Solicitacao $s): string
    {
        $tel = $s->telefone ?: '-';
        $email = $s->email ?: '-';
        $mat = $s->matricula ?: '-';

        return implode("\n", [
            "Solicitação criada pelo Totem de atendimento.",
            // "ID interno: {$s->id}",
            // "Tipo de atendimento (ID): {$s->tipo_atendimento_id}",
            "Nome: {$s->nome}",
            "CPF: {$s->cpf}",
            "E-mail: {$email}",
            "Matrícula: {$mat}",
            "Telefone: {$tel}",
            "Anexo PDF: contém foto e assinatura do solicitante",
        ]);
    }

    private function buildAnexos(Solicitacao $s): array
    {
        $anexos = [];
        $publicBase = rtrim(config('onedoc.public_base_url'), '/');

        if (config('onedoc.enviar_anexo', true) && $s->anexo) {
            $anexos[] = $this->makeAnexoFromStoragePath($s->anexo, $publicBase);
        }

        return array_values(array_filter($anexos, function ($a) {
            return !empty($a['url_original']) && !empty($a['arquivo']);
        }));
    }

    private function makeAnexoFromStoragePath(string $path, string $publicBase): array
    {
        $url = Storage::url($path);
        if (Str::startsWith($url, '/')) {
            $url = $publicBase . $url;
        }

        return [
            'arquivo' => basename($path),
            'tipo' => $this->guessMimeType($path),
            'url_original' => $url,
        ];
    }

    private function guessMimeType(string $path): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return match ($ext) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'pdf' => 'application/pdf',
            default => 'application/octet-stream',
        };
    }
}
