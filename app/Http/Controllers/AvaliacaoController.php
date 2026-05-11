<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\ServicoAvaliacao;
use App\Http\Requests\StoreAvaliacaoRequest;
use App\Http\Requests\UpdateAvaliacaoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AvaliacaoController extends Controller
{
    public function index(Request $request)
    {
        $filtros = $request->validate([
            'servico_id' => ['nullable', 'integer', 'exists:servicos_avaliacao,id'],
            'data_inicio' => ['nullable', 'date'],
            'data_fim' => ['nullable', 'date'],
        ]);

        $servicoFiltro = $filtros['servico_id'] ?? null;
        $dataInicio = $filtros['data_inicio'] ?? null;
        $dataFim = $filtros['data_fim'] ?? null;

        $aplicarFiltros = function ($query) use ($servicoFiltro, $dataInicio, $dataFim) {
            return $query
                ->when($servicoFiltro, fn ($query) => $query->where('servico_avaliacao_id', $servicoFiltro))
                ->when($dataInicio, fn ($query) => $query->whereDate('created_at', '>=', $dataInicio))
                ->when($dataFim, fn ($query) => $query->whereDate('created_at', '<=', $dataFim));
        };

        $servicos = ServicoAvaliacao::query()
            ->withCount('avaliacoes')
            ->withAvg('avaliacoes', 'nota')
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get();

        $resumoNotas = $aplicarFiltros(Avaliacao::query())
            ->selectRaw('nota, COUNT(*) as quantidade')
            ->groupBy('nota')
            ->orderBy('nota')
            ->pluck('quantidade', 'nota');

        $ultimasAvaliacoes = $aplicarFiltros(Avaliacao::query())
            ->with('servicoAvaliacao:id,nome,slug')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Autenticado/Avaliacoes/Index', [
            'servicos' => $servicos,
            'filtros' => [
                'servico_id' => $servicoFiltro,
                'data_inicio' => $dataInicio,
                'data_fim' => $dataFim,
            ],
            'resumoNotas' => [
                1 => (int) ($resumoNotas[1] ?? 0),
                2 => (int) ($resumoNotas[2] ?? 0),
                3 => (int) ($resumoNotas[3] ?? 0),
                4 => (int) ($resumoNotas[4] ?? 0),
                5 => (int) ($resumoNotas[5] ?? 0),
            ],
            'niveis' => [
                1 => 'Pessimo',
                2 => 'Ruim',
                3 => 'Regular',
                4 => 'Bom',
                5 => 'Otimo',
            ],
            'ultimasAvaliacoes' => $ultimasAvaliacoes,
        ]);
    }

    public function store(StoreAvaliacaoRequest $request)
    {
        $dados = $request->validated();

        ServicoAvaliacao::create([
            'nome' => $dados['nome'],
            'slug' => $dados['slug'],
            'descricao' => $dados['descricao'] ?? null,
            'ordem' => ((int) ServicoAvaliacao::query()->max('ordem')) + 1,
            'ativo' => (bool) ($dados['ativo'] ?? true),
        ]);

        return redirect()
            ->route('avaliacoes.index')
            ->with('success', 'Servico para avaliacao criado com sucesso.');
    }

    public function update(UpdateAvaliacaoRequest $request, ServicoAvaliacao $servicoAvaliacao)
    {
        $dados = $request->validated();

        $servicoAvaliacao->update([
            'nome' => $dados['nome'],
            'slug' => $dados['slug'],
            'descricao' => $dados['descricao'] ?? null,
            'ativo' => (bool) ($dados['ativo'] ?? true),
        ]);

        return redirect()
            ->route('avaliacoes.index')
            ->with('success', 'Servico para avaliacao atualizado com sucesso.');
    }

    public function destroy(ServicoAvaliacao $servicoAvaliacao)
    {
        $servicoAvaliacao->delete();

        return redirect()
            ->route('avaliacoes.index')
            ->with('success', 'Servico para avaliacao removido com sucesso.');
    }

    public function reordenar(Request $request)
    {
        $dados = $request->validate([
            'servico_ids' => ['required', 'array', 'min:1'],
            'servico_ids.*' => ['required', 'integer', 'exists:servicos_avaliacao,id'],
        ]);

        DB::transaction(function () use ($dados) {
            foreach ($dados['servico_ids'] as $indice => $id) {
                ServicoAvaliacao::query()
                    ->where('id', $id)
                    ->update(['ordem' => $indice + 1]);
            }
        });

        return back()->with('success', 'Ordem dos servicos atualizada com sucesso.');
    }
}
