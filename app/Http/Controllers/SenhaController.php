<?php

namespace App\Http\Controllers;

use App\Models\Senha;
use App\Http\Requests\StoreSenhaRequest;
use App\Http\Requests\UpdateSenhaRequest;
use Inertia\Inertia;


class SenhaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Senha/Index');
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
    public function store(StoreSenhaRequest $request)
    {
        $data = $request->validated();

        // Mapear prefixo conforme tipo
        $prefixMap = [
            'prova_de_vida'             => 'PV',
            'processo_administrativo'   => 'PA',
            'adiantamento_13'           => 'AD',
            'info_aposentadoria'        => 'IA',
            'info_contribuicao'         => 'CP',
        ];
        $prefix = $prefixMap[$data['tipo']] ?? 'XX';

        // Contar antes de inserir
        $count = Senha::where('tipo', $data['tipo'])->count() + 1;

        // Formatar código, ex: PV-01, PA-02...
        $data['codigo'] = sprintf('%s-%02d', $prefix, $count);

        // Criar registro
        $senha = Senha::create($data);

        return response()->json([
            'message' => 'Senha criada com sucesso',
            'data'    => $senha,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Senha $senha)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Senha $senha)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSenhaRequest $request, Senha $senha)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Senha $senha)
    {
        //
    }
}
