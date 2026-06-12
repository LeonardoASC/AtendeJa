<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use App\Http\Requests\StoreRelatorioRequest;
use App\Http\Requests\UpdateRelatorioRequest;
use Inertia\Inertia;
use App\Models\Senha;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class RelatorioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $from     = $request->date('from');
        $to       = $request->date('to');
        $perPage  = $request->integer('per_page', 25);
        $columns  = $request->input('columns', []);

        $query = Senha::query()
            ->with([
                'tipoAtendimento:id,nome',
                'guiche:id,nome'
            ])
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('created_at', '<=', $to))
            ->latest('created_at');

        $senhas = $query->paginate($perPage)->withQueryString();

        $availableColumns = [
            ['key' => 'id',          'label' => 'ID'],
            ['key' => 'cpf',         'label' => 'CPF'],
            ['key' => 'tipo',        'label' => 'Tipo'],
            ['key' => 'status',      'label' => 'Status'],
            ['key' => 'guiche',      'label' => 'Guichê'],
            ['key' => 'atendente',   'label' => 'Atendente'],
            ['key' => 'criado_em',   'label' => 'Criado em'],
            ['key' => 'tempo',       'label' => 'Tempo atendimento'],
        ];

        return Inertia::render('Autenticado/Relatorios/Index', [
            'senhas'           => $senhas,
            'filters'          => [
                'from'     => optional($from)->format('Y-m-d'),
                'to'       => optional($to)->format('Y-m-d'),
                'columns'  => $columns,
                'per_page' => $perPage,
            ],
            'availableColumns' => $availableColumns,
        ]);
    }

    public function senhasPdf(Request $request)
    {
        try {
            // Log::info('=== Iniciando geração de PDF ===');

            $from = $request->date('from');
            $to   = $request->date('to');

            // Validar se há filtro de data
            if (!$from || !$to) {
                // Log::warning('Tentativa de download sem filtro de data');
                return back()->with('error', 'É obrigatório filtrar por período (De e Até)');
            }

            // Limitar a máximo 90 dias (3 meses)
            $days = $to->diffInDays($from);
            if ($days > 90) {
                // Log::warning('Período solicitado maior que 90 dias', ['days' => $days]);
                return back()->with('error', 'Máximo 3 meses por relatório. Filtre um período menor.');
            }

            // Log::info('Filtros:', ['from' => $from, 'to' => $to, 'dias' => $days]);

            $query = Senha::query()
                ->with(['tipoAtendimento:id,nome', 'guiche:id,nome'])
                ->whereDate('created_at', '>=', $from)
                ->whereDate('created_at', '<=', $to)
                ->latest('created_at')
                ->limit(1000);

            // Log::info('Query SQL:', ['sql' => $query->toSql()]);

            $senhas = $query->get();

            // Log::info('Senhas carregadas:', ['total' => $senhas->count(), 'memory' => memory_get_usage(true) / 1024 / 1024 . 'MB']);

            if ($senhas->isEmpty()) {
                return back()->with('warning', 'Nenhuma senha encontrada neste período');
            }

            // Log::info('Carregando view para PDF');
            $pdf = Pdf::loadView('relatorios.senhas', compact('senhas'))
                ->setPaper('a4', 'portrait')
                ->setOptions(['defaultFont' => 'sans-serif', 'isRemoteEnabled' => false]);

            // Log::info('PDF gerado com sucesso, preparando download');
            $filename = 'relatorio_senhas_' . now()->format('Y-m-d_H-i-s') . '.pdf';
            // Log::info('Iniciando download:', ['filename' => $filename]);

            return $pdf->download($filename);
        } catch (\Exception $e) {
            Log::error('ERRO ao gerar PDF:', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'memory_used' => memory_get_usage(true) / 1024 / 1024 . 'MB',
            ]);

            return back()->with('error', 'Erro ao gerar PDF: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRelatorioRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Relatorio $relatorio)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Relatorio $relatorio)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRelatorioRequest $request, Relatorio $relatorio)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Relatorio $relatorio)
    {
        //
    }
}
