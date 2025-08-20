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
use Illuminate\Support\Str;

class GuicheController extends Controller
{
    public function index()
    {
        return Inertia::render('Autenticado/Guiches/Index', [
            'guiches' => Guiche::with('tiposAtendimento:id,nome')
                ->orderBy('nome')
                ->get(['id','nome']),
            'tiposAtendimentoOptions' => TipoAtendimento::orderBy('nome')->get(['id','nome']),
        ]);
    }

    public function store(StoreGuicheRequest $request)
    {
        $data = $request->validated();

        $guiche = Guiche::create([
            'nome' => $data['nome'],
            'slug' => Str::slug($data['nome']),
        ]);

        $guiche->tiposAtendimento()->sync($data['tipo_atendimento_ids'] ?? []);

        return redirect()
            ->route('guiches.index')
            ->with('success', 'Guichê criado com sucesso!');
    }

    public function update(UpdateGuicheRequest $request, Guiche $guiche)
    {
        $data = $request->validated();

        $guiche->update([
            'nome' => $data['nome'],
            'slug' => Str::slug($data['nome']),
        ]);

        $guiche->tiposAtendimento()->sync($data['tipo_atendimento_ids'] ?? []);

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

    public function guichePanel(Guiche $guiche)
    {
        $tipoIds = $guiche->tiposAtendimento()->pluck('tipo_atendimentos.id');

        $current = Senha::where('guiche_id', $guiche->id)
            ->where('status', 'atendendo')
            ->latest('inicio_atendimento')
            ->first();

        $queue = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'aguardando')
            ->orderBy('created_at')
            ->get(['id', 'codigo', 'nome', 'cpf']);

        $attended = Senha::where('guiche_id', $guiche->id)
            ->where('status', 'atendida')
            ->latest('updated_at')
            ->take(5)
            ->pluck('codigo');

        return Inertia::render('Senha/GuichePanel', [
            'guiche'       => $guiche->slug,
            'initialSenha' => $current,
            'queue'        => $queue,
            'attended'     => $attended,
        ]);
    }
}
