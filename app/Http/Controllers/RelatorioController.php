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
            ->when($from, fn ($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to,   fn ($q) => $q->whereDate('created_at', '<=', $to))
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

    public function senhasPdf()
    {
        $senhas = Senha::all();     
        $pdf = Pdf::loadView('relatorios.senhas', compact('senhas'))
            ->setPaper('a4', 'portrait')
            ->setOptions(['defaultFont' => 'sans-serif']);

        return $pdf->download('relatorio_senhas.pdf');
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
