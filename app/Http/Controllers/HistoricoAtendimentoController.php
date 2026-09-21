<?php

namespace App\Http\Controllers;

use App\Models\Guiche;
use App\Models\Senha;
use App\Models\TipoAtendimento;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoricoAtendimentoController extends Controller
{
    /**
     * Exibe o histórico de atendimentos realizados pelo usuário logado.
     */
    public function index(Request $request)
    {
        $user = $request->user('admin') ?? auth('admin')->user() ?? $request->user() ?? auth()->user();

        if (!$user || empty($user->name)) {
            abort(403, 'Acesso não autorizado. Usuário não autenticado.');
        }

        $userName = trim($user->name);
        $userEmail = trim($user->email ?? '');

        $busca = trim((string) $request->input('busca', ''));
        $dataInicio = $request->input('data_inicio');
        $dataFim = $request->input('data_fim');
        $status = $request->input('status');
        $tipoAtendimentoId = $request->input('tipo_atendimento_id');

        $baseUserQuery = Senha::query()
            ->where(function ($q) use ($userName, $userEmail) {
                $q->where('atendente_nome', $userName)
                  ->orWhereRaw('LOWER(TRIM(atendente_nome)) = ?', [mb_strtolower($userName)]);
                if (!empty($userEmail)) {
                    $q->orWhere('atendente_nome', $userEmail)
                      ->orWhereRaw('LOWER(TRIM(atendente_nome)) = ?', [mb_strtolower($userEmail)]);
                }
            });

        $tz = config('app.timezone', 'America/Sao_Paulo');
        $today = Carbon::today($tz);

        $totalGeral = (clone $baseUserQuery)->count();

        $totalAtendidos = (clone $baseUserQuery)
            ->where('status', 'atendida')
            ->count();

        $totalHoje = (clone $baseUserQuery)
            ->where('status', 'atendida')
            ->whereDate('updated_at', $today)
            ->count();

        $totalCancelados = (clone $baseUserQuery)
            ->where('status', 'cancelada')
            ->count();

        $mediaTempo = (clone $baseUserQuery)
            ->where('status', 'atendida')
            ->whereNotNull('tempo_atendimento')
            ->avg('tempo_atendimento');

        $query = (clone $baseUserQuery)
            ->with([
                'tipoAtendimento:id,nome',
                'guiche:id,nome',
            ])
            ->when($busca !== '', function ($q) use ($busca) {
                $q->where(function ($sq) use ($busca) {
                    $sq->where('codigo', 'like', "%{$busca}%")
                      ->orWhere('nome', 'like', "%{$busca}%")
                      ->orWhere('cpf', 'like', "%{$busca}%")
                      ->orWhere('matricula', 'like', "%{$busca}%");
                });
            })
            ->when(!empty($status), function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when(!empty($tipoAtendimentoId), function ($q) use ($tipoAtendimentoId) {
                $q->where('tipo_atendimento_id', $tipoAtendimentoId);
            })
            ->when(!empty($dataInicio), function ($q) use ($dataInicio) {
                $q->whereDate('created_at', '>=', $dataInicio);
            })
            ->when(!empty($dataFim), function ($q) use ($dataFim) {
                $q->whereDate('created_at', '<=', $dataFim);
            })
            ->orderByRaw('COALESCE(inicio_atendimento, created_at) DESC');

        $atendimentos = $query->paginate(20)->withQueryString();

        $tiposAtendimento = TipoAtendimento::orderBy('nome')->get(['id', 'nome']);

        return Inertia::render('Autenticado/Atendimentos/Historico', [
            'atendimentos' => $atendimentos,
            'filtros' => [
                'busca' => $busca,
                'data_inicio' => $dataInicio,
                'data_fim' => $dataFim,
                'status' => $status,
                'tipo_atendimento_id' => $tipoAtendimentoId,
            ],
            'metricas' => [
                'total_geral' => $totalGeral,
                'total_atendidos' => $totalAtendidos,
                'total_hoje' => $totalHoje,
                'total_cancelados' => $totalCancelados,
                'media_tempo' => $mediaTempo ? (int) round($mediaTempo) : null,
            ],
            'tiposAtendimento' => $tiposAtendimento,
        ]);
    }
}
