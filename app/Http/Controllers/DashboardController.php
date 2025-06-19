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
        ]);
    }
}
