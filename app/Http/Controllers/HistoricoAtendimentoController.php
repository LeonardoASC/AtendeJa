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
                      ->orWhere('matricula', 'like', "%{$busca}%")
                      ->orWhere('avaliacao_tag', 'like', "%{$busca}%")
                      ->orWhere('comentario', 'like', "%{$busca}%");
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

    /**
     * Retorna o histórico de atendimentos do mesmo cidadão que possuem tags/comentários,
     * incluindo comentários feitos por quaisquer atendentes do sistema.
     */
    public function historicoCidadao(Request $request, Senha $senha)
    {
        $cpfLimpo = preg_replace('/\D/', '', (string) $senha->cpf);
        $cpfOriginal = trim((string) $senha->cpf);
        $nome = trim((string) $senha->nome);
        $matricula = trim((string) $senha->matricula);

        $baseQuery = Senha::query();

        // Prioridade por identificador único para uso direto do índice do banco de dados (evita Full Table Scan)
        if (!empty($cpfLimpo)) {
            $baseQuery->where(function ($q) use ($cpfLimpo, $cpfOriginal, $senha) {
                $q->where('id', $senha->id)
                  ->orWhere('cpf', $cpfLimpo);
                if (!empty($cpfOriginal) && $cpfOriginal !== $cpfLimpo) {
                    $q->orWhere('cpf', $cpfOriginal);
                }
            });
        } elseif (!empty($matricula)) {
            $baseQuery->where(function ($q) use ($matricula, $senha) {
                $q->where('id', $senha->id)
                  ->orWhere('matricula', $matricula);
            });
        } elseif (!empty($nome)) {
            $baseQuery->where(function ($q) use ($nome, $senha) {
                $q->where('id', $senha->id)
                  ->orWhere('nome', $nome);
            });
        } else {
            $baseQuery->where('id', $senha->id);
        }

        $totalAtendimentos = (clone $baseQuery)->count();

        $comentarios = (clone $baseQuery)
            ->select([
                'id',
                'codigo',
                'avaliacao_tag',
                'avaliacao_cor',
                'comentario',
                'avaliacao_atendente_nome',
                'avaliado_em',
                'inicio_atendimento',
                'created_at',
                'tipo_atendimento_id',
                'guiche_id',
            ])
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
            ->orderByRaw('COALESCE(inicio_atendimento, created_at) DESC')
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'outros_atendimentos' => $comentarios,
            'total_anteriores' => $totalAtendimentos,
        ]);
    }

    /**
     * Salva a tag de avaliação e comentário do atendimento (registro imutável).
     */
    public function salvarAvaliacao(Request $request, Senha $senha)
    {
        $user = $request->user('admin') ?? auth('admin')->user() ?? $request->user() ?? auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Não autorizado.'], 403);
        }

        // Não permite editar se já houver avaliação ou comentário registrado
        if (!empty($senha->avaliacao_tag) || !empty($senha->comentario)) {
            return response()->json([
                'error' => 'Este atendimento já possui anotação registrada e não pode ser editado.',
                'message' => 'Este atendimento já possui anotação registrada e não pode ser editado.',
            ], 422);
        }

        $validated = $request->validate([
            'avaliacao_tag' => ['nullable', 'string', 'max:100'],
            'avaliacao_cor' => ['nullable', 'string', 'max:7', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'comentario' => ['nullable', 'string', 'max:3000'],
        ]);

        $tag = !empty(trim((string) ($validated['avaliacao_tag'] ?? ''))) ? trim((string) $validated['avaliacao_tag']) : null;
        $cor = (!empty($tag) && !empty(trim((string) ($validated['avaliacao_cor'] ?? '')))) ? trim((string) $validated['avaliacao_cor']) : ($tag ? '#0D9488' : null);
        $comentario = !empty(trim((string) ($validated['comentario'] ?? ''))) ? trim((string) $validated['comentario']) : null;

        if (!$tag && !$comentario) {
            return response()->json([
                'error' => 'Informe ao menos uma tag ou comentário para registrar.',
                'message' => 'Informe ao menos uma tag ou comentário para registrar.',
            ], 422);
        }

        $atendenteNome = trim($user->name ?: ($senha->atendente_nome ?: 'Atendente'));

        $senha->update([
            'avaliacao_tag' => $tag,
            'avaliacao_cor' => $cor,
            'comentario' => $comentario,
            'avaliacao_atendente_nome' => $atendenteNome,
            'avaliado_em' => Carbon::now(config('app.timezone', 'America/Sao_Paulo')),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comentário registrado com sucesso!',
            'senha' => $senha->fresh(['tipoAtendimento:id,nome', 'guiche:id,nome']),
        ]);
    }
}
