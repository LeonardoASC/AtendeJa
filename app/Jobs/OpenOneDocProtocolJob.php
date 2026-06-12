<?php

namespace App\Jobs;

use App\Models\Solicitacao;
use App\Services\OneDoc\OneDocProtocolService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class OpenOneDocProtocolJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Número de tentativas antes de marcar como falho
     */
    public $tries = 3;

    /**
     * Backoff em segundos entre tentativas (exponencial)
     */
    public $backoff = [60, 300, 900]; // 1 min, 5 min, 15 min

    /**
     * Timeout em segundos
     */
    public $timeout = 120;

    public function __construct(
        public int $solicitacaoId
    ) {}

    public function handle(OneDocProtocolService $service): void
    {
        $solicitacao = Solicitacao::find($this->solicitacaoId);

        if (!$solicitacao) {
            Log::warning('OpenOneDocProtocolJob: solicitacao não encontrada', ['id' => $this->solicitacaoId]);
            return;
        }

        if ($solicitacao->onedoc_hash) {
            Log::info('OpenOneDocProtocolJob: já possui hash, pulando', ['id' => $this->solicitacaoId]);
            return;
        }

        try {
            $service->openProtocolFromSolicitacao($solicitacao);
            $solicitacao->status = 'enviado';
            $solicitacao->save();

            Log::info('OpenOneDocProtocolJob: Protocolo aberto com sucesso', [
                'solicitacao_id' => $solicitacao->id,
                'onedoc_numero' => $solicitacao->onedoc_numero,
            ]);
        } catch (Throwable $e) {
            $solicitacao->onedoc_status = 'erro';
            $solicitacao->onedoc_error = $e->getMessage();
            $solicitacao->save();

            Log::error('Erro ao abrir protocolo no 1Doc', [
                'solicitacao_id' => $solicitacao->id,
                'error' => $e->getMessage(),
                'tentativa' => $this->attempts(),
                'max_tentativas' => $this->tries,
            ]);

            // Relança a exceção para que o Laravel tente novamente
            throw $e;
        }
    }

    /**
     * Chamado quando o job falha após todas as tentativas
     */
    public function failed(Throwable $exception): void
    {
        $solicitacao = Solicitacao::find($this->solicitacaoId);

        if ($solicitacao) {
            $solicitacao->onedoc_status = 'falha_permanente';
            $solicitacao->onedoc_error = 'Falha após ' . $this->tries . ' tentativas: ' . $exception->getMessage();
            $solicitacao->save();

            Log::error('OpenOneDocProtocolJob: Falha permanente após todas as tentativas', [
                'solicitacao_id' => $solicitacao->id,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
