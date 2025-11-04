<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Senha;



class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cpfMaisFrequente = Senha::select('cpf', DB::raw('count(*) as total'))
            ->groupBy('cpf')
            ->orderByDesc('total')
            ->value('cpf');

        $dia = Senha::where('status', 'atendida')
            ->whereDate('updated_at', Carbon::today())
            ->count();
        $semana = Senha::where('status', 'atendida')
            ->whereBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->count();
        $mes = Senha::where('status', 'atendida')
            ->whereMonth('updated_at', Carbon::now()->month)
            ->whereYear('updated_at', Carbon::now()->year)
            ->count();
        $ano = Senha::where('status', 'atendida')
            ->whereYear('updated_at', Carbon::now()->year)
            ->count();

        $mediaTempo = Senha::whereNotNull('tempo_atendimento')->avg('tempo_atendimento');

        $pico = Senha::select(DB::raw('HOUR(created_at) as hora'), DB::raw('count(*) as total'))
            ->groupBy('hora')
            ->orderByDesc('total')
            ->first();

        $seriesHora = Senha::selectRaw('HOUR(created_at) as hora, COUNT(*) as total')
            ->whereDate('created_at', Carbon::today())
            ->groupBy('hora')
            ->orderBy('hora')
            ->pluck('total', 'hora');

        return Inertia::render('Autenticado/Dashboard/Index', [
            'metrics' => [
                'cpf_mais_frequente' => $cpfMaisFrequente,
                'dia'   => $dia,
                'semana' => $semana,
                'mes'   => $mes,
                'ano'   => $ano,
                'media_tempo' => $mediaTempo ? (int) round($mediaTempo) : null,
                'hora_pico'   => $pico?->hora,
            ],
            'seriesHora' => $seriesHora,
        ]);
    }

    public function ranking(Request $request)
    {
        $period = $request->input('period', 'week');
        $tz = config('app.timezone', 'America/Sao_Paulo');
        $now = Carbon::now($tz);

        $start = null;
        $end = null;
        $label = '';

        switch ($period) {
            case 'today':
                $start = $now->copy()->startOfDay();
                $end = $now->copy()->endOfDay();
                $label = 'hoje';
                break;
            case 'week':
                $start = $now->copy()->startOfWeek(Carbon::MONDAY);
                $end = $now->copy()->endOfWeek(Carbon::SUNDAY);
                $label = 'esta semana';
                break;
            case 'month':
                $start = $now->copy()->startOfMonth();
                $end = $now->copy()->endOfMonth();
                $label = 'este mês';
                break;
            case 'year':
                $start = $now->copy()->startOfYear();
                $end = $now->copy()->endOfYear();
                $label = 'este ano';
                break;
            case 'all':
            default:
                $label = 'todos os tempos';
                break;
        }

        $query = Senha::query()
            ->select('atendente_nome', DB::raw('COUNT(*) as total_atendimentos'))
            ->where('status', 'atendida')
            ->whereNotNull('atendente_nome');

        if ($start && $end) {
            $query->where('created_at', '>=', $start->format('Y-m-d H:i:s'))
                ->where('created_at', '<=', $end->format('Y-m-d H:i:s'));
        }

        $rankingAtendentes = $query
            ->groupBy('atendente_nome')
            ->orderByDesc('total_atendimentos')
            ->limit(10)
            ->get();

        $queryNaoAtendidas = Senha::query()
            ->where('status', '!=', 'atendida');

        if ($start && $end) {
            $queryNaoAtendidas->where('created_at', '>=', $start->format('Y-m-d H:i:s'))
                ->where('created_at', '<=', $end->format('Y-m-d H:i:s'));
        }

        $totalNaoAtendidas = $queryNaoAtendidas->count();

        $queryStats = Senha::query();

        if ($start && $end) {
            $queryStats->where('created_at', '>=', $start->format('Y-m-d H:i:s'))
                ->where('created_at', '<=', $end->format('Y-m-d H:i:s'));
        }

        $totalSenhas = $queryStats->count();

        $statusCounts = Senha::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->when($start && $end, function ($q) use ($start, $end) {
                $q->where('created_at', '>=', $start->format('Y-m-d H:i:s'))
                    ->where('created_at', '<=', $end->format('Y-m-d H:i:s'));
            })
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Autenticado/Dashboard/Ranking', [
            'rankingAtendentes' => $rankingAtendentes,
            'period'           => $period,
            'label'            => $label,
            'generated_at'     => $now->toDateTimeString(),
            'totalNaoAtendidas' => $totalNaoAtendidas,
            'estatisticas' => [
                'total' => $totalSenhas,
                'por_status' => $statusCounts,
            ],
        ]);
    }
}
