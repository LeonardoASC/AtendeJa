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
            ->get(['id', 'codigo', 'nome', 'cpf', 'avaliacao_cor', 'avaliacao_tag', 'comentario']);

        // Mapear os CPFs envolvidos para buscar o último comentário/avaliação de cada cidadão
        $cpfs = collect();
        if ($current && !empty($current->cpf)) {
            $cpfs->push((string) $current->cpf);
            $clean = preg_replace('/\D/', '', (string) $current->cpf);
            if (!empty($clean)) {
                $cpfs->push($clean);
            }
        }

        foreach ($queue as $q) {
            if (!empty($q->cpf)) {
                $cpfs->push((string) $q->cpf);
                $clean = preg_replace('/\D/', '', (string) $q->cpf);
                if (!empty($clean)) {
                    $cpfs->push($clean);
                }
            }
        }

        $cpfs = $cpfs->filter()->unique()->values();

        $avaliacoesPorCpf = [];
        if ($cpfs->isNotEmpty()) {
            $registros = Senha::whereIn('cpf', $cpfs)
                ->where(function ($query) {
                    $query->whereNotNull('avaliacao_cor')
                          ->where('avaliacao_cor', '!=', '')
                          ->orWhereNotNull('avaliacao_tag')
                          ->where('avaliacao_tag', '!=', '')
                          ->orWhereNotNull('comentario')
                          ->where('comentario', '!=', '');
                })
                ->orderByRaw('COALESCE(avaliado_em, inicio_atendimento, created_at) DESC')
                ->get(['id', 'cpf', 'avaliacao_cor', 'avaliacao_tag', 'comentario', 'avaliado_em', 'created_at']);

            foreach ($registros as $reg) {
                $cpfLimpo = preg_replace('/\D/', '', (string) $reg->cpf);
                $cor = !empty($reg->avaliacao_cor) ? $reg->avaliacao_cor : '#0D9488';
                $tag = $reg->avaliacao_tag ?: ($reg->comentario ? 'Comentário registrado' : null);
                $comentario = $reg->comentario;

                $dados = [
                    'cor' => $cor,
                    'tag' => $tag,
                    'comentario' => $comentario,
                ];

                if (!empty($cpfLimpo) && !isset($avaliacoesPorCpf[$cpfLimpo])) {
                    $avaliacoesPorCpf[$cpfLimpo] = $dados;
                }
                if (!empty($reg->cpf) && !isset($avaliacoesPorCpf[$reg->cpf])) {
                    $avaliacoesPorCpf[$reg->cpf] = $dados;
                }
            }
        }

        if ($current) {
            $cleanCurrent = preg_replace('/\D/', '', (string) $current->cpf);
            $avaliacao = $avaliacoesPorCpf[$cleanCurrent] ?? $avaliacoesPorCpf[$current->cpf] ?? null;
            $current->setAttribute('historico_cor', $current->avaliacao_cor ?: ($avaliacao['cor'] ?? null));
            $current->setAttribute('historico_tag', $current->avaliacao_tag ?: ($avaliacao['tag'] ?? null));
            $current->setAttribute('historico_comentario', $current->comentario ?: ($avaliacao['comentario'] ?? null));
        }

        $queue->transform(function ($item) use ($avaliacoesPorCpf) {
            $clean = preg_replace('/\D/', '', (string) $item->cpf);
            $avaliacao = $avaliacoesPorCpf[$clean] ?? $avaliacoesPorCpf[$item->cpf] ?? null;
            $item->setAttribute('historico_cor', $item->avaliacao_cor ?: ($avaliacao['cor'] ?? null));
            $item->setAttribute('historico_tag', $item->avaliacao_tag ?: ($avaliacao['tag'] ?? null));
            $item->setAttribute('historico_comentario', $item->comentario ?: ($avaliacao['comentario'] ?? null));
            return $item;
        });

        $attended = Senha::where('guiche_id', $guiche->id)
            ->where('status', 'atendida')
            ->latest('updated_at')
            ->take(5)
            ->pluck('codigo');

        $comentariosCidadao = [];
        if ($current && !empty($current->cpf)) {
            $cleanCurrent = preg_replace('/\D/', '', (string) $current->cpf);
            $cpfVariants = array_values(array_filter([(string) $current->cpf, $cleanCurrent]));

            $comentariosCidadao = Senha::whereIn('cpf', $cpfVariants)
                ->where(function ($q) {
                    $q->where(function ($sq) {
                        $sq->whereNotNull('comentario')
                           ->where('comentario', '!=', '');
                    })->orWhere(function ($sq) {
                        $sq->whereNotNull('avaliacao_tag')
                           ->where('avaliacao_tag', '!=', '');
                    });
                })
                ->with([
                    'tipoAtendimento:id,nome',
                    'guiche:id,nome',
                ])
                ->orderByRaw('COALESCE(avaliado_em, inicio_atendimento, created_at) DESC')
                ->limit(50)
                ->get([
                    'id',
                    'codigo',
                    'cpf',
                    'nome',
                    'avaliacao_tag',
                    'avaliacao_cor',
                    'comentario',
                    'avaliacao_atendente_nome',
                    'avaliado_em',
                    'inicio_atendimento',
                    'created_at',
                    'tipo_atendimento_id',
                    'guiche_id',
                ]);
        }

        return Inertia::render('Senha/GuichePanel', [
            'guiche'              => $guiche->slug,
            'initialSenha'        => $current,
            'queue'               => $queue,
            'attended'            => $attended,
            'comentariosCidadao'  => $comentariosCidadao,
        ]);
    }
}
