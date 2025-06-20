<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use App\Http\Requests\StoreRelatorioRequest;
use App\Http\Requests\UpdateRelatorioRequest;
use Inertia\Inertia;
use App\Models\Senha;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;


class RelatorioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Autenticado/Relatorios/Index');
    }

    public function senhasPdf()
    {
        $senhas = Senha::with('tipoAtendimento')
            ->whereDate('created_at', Carbon::today())
            ->get();

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
