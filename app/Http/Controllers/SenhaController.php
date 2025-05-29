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
use App\Events\SenhaCriada;


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
        $tipo  = TipoAtendimento::findOrFail($data['tipo_atendimento_id']);
        
        $prefix = Senha::gerarPrefixo($tipo->nome);
        
        $ultimo = Senha::where('tipo_atendimento_id', $tipo->id)
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
            'cpf'        => $data['cpf'],
            'codigo'     => $codigo,
            'prioridade' => 'baixa',
            'status'     => 'aguardando',
            'tipo_atendimento_id' => $tipo->id,
        ]);
   
        SenhaCriada::dispatch($senha);

        return redirect()->route('senhas.index');
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

    public function telao()
    {
        $senhasAtendidas = Senha::with('tipoAtendimento')
            ->where('status', 'atendida')
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Senha/Telao', [
            'senhasAtendidas' => $senhasAtendidas,
        ]);
    }

    public function guichePanel(string $guiche)
    {
        $tipoIds = TipoAtendimento::where('guiche', $guiche)->pluck('id');

        $current = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'atendendo')
            ->latest('updated_at')
            ->first();

        $queue = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'aguardando')
            ->orderBy('created_at')
            ->take(5)
            ->pluck('codigo');

        $attended = Senha::whereIn('tipo_atendimento_id', $tipoIds)
            ->where('status', 'atendida')
            ->latest('updated_at')
            ->take(5)
            ->pluck('codigo');

        return Inertia::render('Senha/GuichePanel', [
            'guiche'       => $guiche,
            'initialSenha' => $current,
            'queue'        => $queue,
            'attended'     => $attended,
        ]);
    }

    public function chamar(Request $request)
    {
        $guiche = (int) $request->input('guiche');

        DB::transaction(function () use ($guiche) {
            $tipoIds = TipoAtendimento::where('guiche', $guiche)->pluck('id');
            $senha = Senha::whereIn('tipo_atendimento_id', $tipoIds)
                ->where('status', 'aguardando')
                ->orderBy('created_at')
                ->lockForUpdate()
                ->firstOrFail();

            $senha->update([
                'status'     => 'atendendo',
            ]);
        });

        return redirect()->route('guiche.panel', ['guiche' => $guiche]);
    }

    public function finalizar(Request $request, Senha $senha)
    {
        $senha->update([
            'status'      => 'atendida',
        ]);

        $guiche = $request->input('guiche');

        if (!$guiche) {
            $senha->load('tipoAtendimento');
            $guiche = $senha->tipoAtendimento->guiche;
        }

        return redirect()->route('guiche.panel', ['guiche' => $guiche]);
    }
   
}
