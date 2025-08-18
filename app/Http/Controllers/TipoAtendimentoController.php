<?php

namespace App\Http\Controllers;

use App\Models\TipoAtendimento;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTipoAtendimentoRequest;
use App\Http\Requests\UpdateTipoAtendimentoRequest;
use Inertia\Inertia;

class TipoAtendimentoController extends Controller
{

    public function index()
    {
        return Inertia::render('Autenticado/TipoAtendimento/Index', [
            'tipoAtendimentos' => TipoAtendimento::orderBy('nome')->get(),
        ]);
    }

    public function store(StoreTipoAtendimentoRequest $request)
    {
        TipoAtendimento::create($request->validated());

        return redirect()
            ->route('tipo-atendimentos.index')
            ->with('success', 'Tipo de atendimento criado com sucesso!');
    }

    /**
     * Atualiza um tipo de atendimento existente.
     */
    public function update(UpdateTipoAtendimentoRequest $request, TipoAtendimento $tipoAtendimento)
    {
        $tipoAtendimento->update($request->validated());

        return redirect()
            ->route('tipo-atendimentos.index')
            ->with('success', 'Tipo de atendimento atualizado com sucesso!');
    }

    public function destroy(TipoAtendimento $tipoAtendimento)
    {
        $tipoAtendimento->delete();

        return redirect()
            ->route('tipo-atendimentos.index')
            ->with('success', 'Tipo de atendimento excluído com sucesso!');
    }
}
