<?php

namespace App\Services\OneDoc;

use App\Models\Solicitacao;
use App\Models\TipoAtendimento;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class OneDocProtocolService
{
    public function __construct(
        private OneDocClient $client
    ) {}

    /**
     * Descobre se esta solicitação deve abrir algum protocolo e qual config usar.
     */
    public function resolveTipoAtendimentoForSolicitacao(Solicitacao $solicitacao): ?TipoAtendimento
    {
        return TipoAtendimento::query()
            ->select(['id', 'nome', 'onedoc_enabled', 'onedoc_destino_id_setor', 'onedoc_id_assunto'])
            ->whereKey($solicitacao->tipo_atendimento_id)
            ->first();
    }

    /**
     * Abre protocolo no 1Doc usando multipart/form-data no padrão do Swagger.
     */
    public function openProtocolFromSolicitacao(Solicitacao $solicitacao): array
    {
        // Log::info('=== INÍCIO ABERTURA PROTOCOLO ONEDOC ===', [
        //     'solicitacao_id' => $solicitacao->id,
        //     'tipo_atendimento_id' => $solicitacao->tipo_atendimento_id,
        // ]);

        $tipoAtendimento = $this->resolveTipoAtendimentoForSolicitacao($solicitacao);

        if (!$tipoAtendimento || !$tipoAtendimento->onedoc_enabled) {
            // Log::warning('Protocolo SKIPPED - Nenhuma config encontrada');
            return [
                'skipped' => true,
                'reason' => 'OneDoc desabilitado para esse tipo_atendimento_id.',
            ];
        }

        $protocolName = (string) ($tipoAtendimento->nome ?? 'desconhecido');

        // Log::info('Protocolo resolvido', ['protocol_name' => $protocolName]);

        $destinoIdSetor = (int) ($tipoAtendimento->onedoc_destino_id_setor ?? 0);
        $idAssunto = (int) ($tipoAtendimento->onedoc_id_assunto ?? 0);

        if ($destinoIdSetor <= 0 || $idAssunto <= 0) {
            throw new \RuntimeException("Config do 1Doc incompleta para [$protocolName]. Verifique destino_id_setor e id_assunto.");
        }

        // Log::info('Configuração validada', [
        //     'destino_id_setor' => $destinoIdSetor,
        //     'id_assunto' => $idAssunto,
        // ]);

        $now = now();


        $conteudo = $this->buildConteudo($solicitacao);

        $campos = config('onedoc.campos_padrao', []);
        if (!is_array($campos)) {
            $campos = [];
        }

        $anexos = $this->buildAnexos($solicitacao);

        // Log::info('Anexos construídos', [
        //     'count' => count($anexos),
        //     'anexos' => $anexos,
        // ]);

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

        // Log::info('OneDoc payload (multipart fields) pronto', [
        //     'protocol_name' => $protocolName,
        //     'fields' => $fields,
        // ]);

        // Log::info('>>> CHAMANDO API ONEDOC <<<');

        try {
            $response = $this->client->postMultipart('/protocolos', $fields);

            // Log::info('=== SUCESSO: Protocolo criado ===', [
            //     'response' => $response,
            // ]);
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
        $tel = $this->resolverTelefoneSolicitacao($s);
        $email = $s->email ?: '-';
        $mat = $s->matricula ?: '-';

        return implode("\n", [
            "Solicitação criada pelo Totem de atendimento.",
            "Serviço: {$s->tipoAtendimento->nome}",
            "Nome: {$s->nome}",
            "CPF: {$s->cpf}",
            "E-mail: {$email}",
            "Matrícula: {$mat}",
            "Telefone: {$tel}",
            "Anexo PDF: contém foto e assinatura do solicitante",
        ]);
    }

    private function resolverTelefoneSolicitacao(Solicitacao $s): string
    {
        $dadosFormulario = is_array($s->dados_formulario) ? $s->dados_formulario : [];

        foreach (['TEL_CELULAR', 'TEL_RESIDENCIAL', 'TEL_OUTRO'] as $campo) {
            $valor = $dadosFormulario[$campo] ?? null;

            if (is_array($valor)) {
                $valor = reset($valor);
            }

            $valorNormalizado = is_scalar($valor) ? trim((string) $valor) : '';

            if ($valorNormalizado !== '') {
                return $valorNormalizado;
            }
        }

        $telefoneFallback = trim((string) ($s->telefone ?? ''));

        return $telefoneFallback !== '' ? $telefoneFallback : '-';
    }

    private function buildAnexos(Solicitacao $s): array
    {
        $anexos = [];

        if (config('onedoc.enviar_anexo', true) && $s->anexo) {
            $anexos[] = $this->makeSignedAnexoFromStoragePath($s->anexo, $s->id);
        }

        return array_values(array_filter($anexos, function ($a) {
            return !empty($a['url_original']) && !empty($a['arquivo']);
        }));
    }

    private function makeSignedAnexoFromStoragePath(string $path, int $solicitacaoId): array
    {
        $diskName = $this->resolveAnexoDisk($path);

        if (!$diskName) {
            throw new \RuntimeException("Anexo da solicitacao [$solicitacaoId] nao encontrado no storage: {$path}");
        }

        $expiresAt = now()->addHours(max(1, (int) config('onedoc.anexo_url_expira_horas', 24)));
        $expires = $expiresAt->getTimestamp();
        $url = URL::route('onedoc.anexos.show', [
            'solicitacao' => $solicitacaoId,
            'expires' => $expires,
            'token' => $this->makeAnexoToken($solicitacaoId, $expires),
            'filename' => basename($path),
        ]);

        Log::info('OneDoc anexo preparado', [
            'solicitacao_id' => $solicitacaoId,
            'arquivo' => basename($path),
            'path' => $path,
            'disk' => $diskName,
            'expires_at' => $expiresAt->toDateTimeString(),
            'url_original' => $url,
        ]);

        return [
            'arquivo' => basename($path),
            'tipo' => $this->guessMimeType($path),
            'url_original' => $url,
        ];
    }

    private function resolveAnexoDisk(string $path): ?string
    {
        foreach (['local', 'public'] as $diskName) {
            if (Storage::disk($diskName)->exists($path)) {
                return $diskName;
            }
        }

        return null;
    }

    private function makeAnexoToken(int $solicitacaoId, int $expires): string
    {
        return substr(hash_hmac('sha256', "{$solicitacaoId}|{$expires}", (string) config('app.key')), 0, 32);
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
