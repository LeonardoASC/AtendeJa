<?php

namespace App\Http\Controllers;

use App\Models\Senha;
use App\Http\Requests\StoreSenhaRequest;
use App\Http\Requests\UpdateSenhaRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\TipoAtendimento;


class SenhaController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $tipoAtendimentos = TipoAtendimento::all();
        $senha = session('senha');
        return Inertia::render('Senha/Index', [
            'tipoAtendimentos' => $tipoAtendimentos,
             'senha'           => $senha,
        ]);
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
        $tipo = $data['tipo'];
        $prefix = Senha::gerarPrefixo($tipo);

        $ultimo = Senha::where('tipo', $tipo)
            ->whereDate('created_at', Carbon::today())
            ->orderBy('id', 'desc')
            ->first();
        
        if ($ultimo) {
            // se tiver senha, pega o número dela e incrementa mais 1
            $numero = intval(substr($ultimo->codigo, strpos($ultimo->codigo, '-') + 1));
            $next   = $numero + 1;
        } else {
            // se não tiver senha, começa do 1
            $next = 1;
        }

        // formata 001, 002, ..., 010, 011...
        $seq    = str_pad($next, 3, '00', STR_PAD_LEFT);
        $codigo = "{$prefix}-{$seq}";

        // cria a senha
        $senha = Senha::create([
            'tipo'       => $tipo,
            'cpf'        => $data['cpf'],
            'codigo'     => $codigo,
            'prioridade' => 'baixa',
            'status'     => 'aguardando',
        ]);

        return redirect()
        ->route('senhas.index')
        ->with('senha', [
            'tipo'   => $senha->tipo,
            'cpf'    => $senha->cpf,
            'codigo' => $senha->codigo,
        ]);
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
