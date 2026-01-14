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
    public $tries = 1;

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
        } catch (Throwable $e) {
            $solicitacao->onedoc_status = 'erro';
            $solicitacao->onedoc_error = $e->getMessage();
            $solicitacao->save();

            Log::error('Erro ao abrir protocolo no 1Doc', [
                'solicitacao_id' => $solicitacao->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
