<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVisitaTecnicaRequest;
use App\Models\VisitaTecnica;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitaTecnicaController extends Controller
{
    public function index(Request $request)
    {
        $filtros = [
            'busca' => trim((string) $request->query('busca', '')),
            'status' => $request->query('status'),
            'exercicio' => $request->query('exercicio'),
        ];

        $visitas = VisitaTecnica::query()
            ->when($filtros['busca'] !== '', function ($query) use ($filtros) {
                $termo = $filtros['busca'];
                $cpf = preg_replace('/\D/', '', $termo);

                $query->where(function ($subQuery) use ($termo, $cpf) {
                    $subQuery->where('nome', 'like', "%{$termo}%")
                        ->orWhere('protocolo', 'like', "%{$termo}%")
                        ->orWhere('email', 'like', "%{$termo}%")
                        ->when($cpf !== '', fn ($q) => $q->orWhere('cpf', 'like', "%{$cpf}%"));
                });
            })
            ->when(in_array($filtros['status'], [
                VisitaTecnica::STATUS_PENDENTE,
                VisitaTecnica::STATUS_AGENDADA,
                VisitaTecnica::STATUS_REALIZADA,
                VisitaTecnica::STATUS_CANCELADA,
            ], true), fn ($query) => $query->where('status', $filtros['status']))
            ->when(!empty($filtros['exercicio']), fn ($query) => $query->where('exercicio', (int) $filtros['exercicio']))
            ->latest()
            ->paginate(20, ['id', 'protocolo', 'exercicio', 'status', 'nome', 'cpf', 'telefone', 'bairro', 'exige_documentacao_medica', 'created_at'])
            ->withQueryString();

        return Inertia::render('Autenticado/VisitasTecnicas/Index', [
            'visitas' => $visitas,
            'filtros' => $filtros,
            'contagem' => VisitaTecnica::query()
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'exercicios' => VisitaTecnica::query()
                ->distinct()
                ->orderByDesc('exercicio')
                ->pluck('exercicio'),
        ]);
    }

    public function show(VisitaTecnica $visitaTecnica)
    {
        $visitaTecnica->load('admin:id,name')->makeVisible('codigo_seguranca');

        return Inertia::render('Autenticado/VisitasTecnicas/Show', [
            'visita' => $visitaTecnica,
            'historico' => VisitaTecnica::query()
                ->where('cpf', $visitaTecnica->cpf)
                ->whereKeyNot($visitaTecnica->id)
                ->latest()
                ->get(['id', 'protocolo', 'exercicio', 'status', 'realizada_em', 'condicao_constatada', 'created_at']),
        ]);
    }

    /**
     * Recebe a solicitação pública de prova de vida em atendimento domiciliar.
     */
    public function store(StoreVisitaTecnicaRequest $request): JsonResponse
    {
        $dados = $request->safe()->except('website');
        $exercicio = now()->year;

        $visita = VisitaTecnica::create([
            ...$dados,
            'protocolo' => VisitaTecnica::generateUniqueProtocolo($exercicio),
            'exercicio' => $exercicio,
            'status' => VisitaTecnica::STATUS_PENDENTE,
            'canal' => 'eletronico',
            'exige_documentacao_medica' => VisitaTecnica::cpfExigeDocumentacaoMedica($dados['cpf']),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
        ]);

        return response()->json([
            'message' => 'Solicitação registrada. O PREVMOC entrará em contato para confirmar o atendimento.',
            'data' => [
                'protocolo' => $visita->protocolo,
                'exercicio' => $visita->exercicio,
                'status' => $visita->status,
                'created_at' => $visita->created_at,
            ],
        ], 201);
    }
}
