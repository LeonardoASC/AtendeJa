<?php

namespace App\Http\Controllers;

use App\Models\Guiche;
use App\Http\Requests\StoreGuicheRequest;
use App\Http\Requests\UpdateGuicheRequest;
use Inertia\Inertia;
use App\Models\TipoAtendimento;
use App\Models\Senha;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GuicheController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guiches = Guiche::all();
        return Inertia::render('Autenticado/Guiches/Index', [
            'guiches' => $guiches,
        ]);
    }

    public function guichePanel(string $guiche)
    {
        $tipoIds = TipoAtendimento::where('guiche', $guiche)->pluck('id');

        $current = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'atendendo')
            ->latest('updated_at')
            ->first();

        $queue = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'aguardando')
            ->orderBy('created_at')
            ->take(5)
            ->pluck('codigo');

        $attended = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'atendida')
            ->latest('updated_at')
            ->take(5)
            ->pluck('codigo');

        return Inertia::render('Senha/GuichePanel', [
            'guiche'       => $guiche,
            'initialSenha' => $current,
            'queue'        => $queue,
            'attended'     => $attended,
        ]);
    }
}
