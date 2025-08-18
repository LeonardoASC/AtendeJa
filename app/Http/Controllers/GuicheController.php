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
    public function index()
    {
        return Inertia::render('Autenticado/Guiches/Index', [
            'guiches' => Guiche::with('tiposAtendimento:id,nome')
                ->orderBy('numero')
                ->get(['id','numero']),
            'tiposAtendimentoOptions' => TipoAtendimento::orderBy('nome')->get(['id','nome']),
        ]);
    }

    public function store(StoreGuicheRequest $request)
    {
        $guiche = Guiche::create([
            'numero' => $request->validated()['numero'],
        ]);

        $guiche->tiposAtendimento()->sync($request->validated()['tipo_atendimento_ids'] ?? []);

        return redirect()
            ->route('guiches.index')
            ->with('success', 'Guichê criado com sucesso!');
    }

    public function update(UpdateGuicheRequest $request, Guiche $guiche)
    {
        $guiche->update([
            'numero' => $request->validated()['numero'],
        ]);

        $guiche->tiposAtendimento()->sync($request->validated()['tipo_atendimento_ids'] ?? []);

        return redirect()
            ->route('guiches.index')
            ->with('success', 'Guichê atualizado com sucesso!');
    }

    public function destroy(Guiche $guiche)
    {
        $guiche->delete();

        return redirect()
            ->route('guiches.index')
            ->with('success', 'Guichê excluído com sucesso!');
    }

    public function selectGuiche()
    {
        $guiches = Guiche::all();
        return Inertia::render('Autenticado/Guiches/SelectGuiche', [
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
            ->get(['id', 'codigo', 'nome', 'cpf']);

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
