<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

/**
 * Limita cadastros com sucesso por IP: intervalo mínimo entre cadastros e
 * máximo diário. Só respostas 201 contam, para não punir erros de validação.
 */
class LimitarCadastroVisitaTecnica
{
    public function handle(Request $request, Closure $next): Response
    {
        $limites = $this->limites($request);

        foreach ($limites as [$chave, $maximo]) {
            if (RateLimiter::tooManyAttempts($chave, $maximo)) {
                $segundos = RateLimiter::availableIn($chave);

                return response()->json([
                    'message' => 'Muitas solicitações enviadas. Tente novamente mais tarde.',
                    'retry_after' => $segundos,
                ], 429, ['Retry-After' => $segundos]);
            }
        }

        $response = $next($request);

        if ($response->getStatusCode() === Response::HTTP_CREATED) {
            foreach ($limites as [$chave, , $decaimento]) {
                RateLimiter::hit($chave, $decaimento);
            }
        }

        return $response;
    }

    /**
     * @return array<int, array{0: string, 1: int, 2: int}>
     */
    private function limites(Request $request): array
    {
        $ip = $request->ip();

        return [
            ["visita-tecnica:intervalo:{$ip}", 1, config('visita_tecnica.intervalo_entre_cadastros')],
            ["visita-tecnica:dia:{$ip}", config('visita_tecnica.cadastros_por_dia'), 86400],
        ];
    }
}
