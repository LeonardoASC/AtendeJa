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
use App\Events\SenhaAtualizada;


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
    public function show(Senha $senha)
    {
        $senha->load('tipoAtendimento');

        return Inertia::render('Senha/Show', [
            'senha' => [
                'codigo' => $senha->codigo,
                'cpf'    => $senha->cpf,
                'tipo'   => optional($senha->tipoAtendimento)->nome,
                'created_at' => $senha->created_at->format('d/m/Y H:i'),
                'public_token' => $senha->public_token,
            ],
        ]);
    }

    public function perguntasFrequentes()
    {
        $perguntasFrequentes = [
            ['pergunta' => 'Como gerar minha senha?', 'resposta' => 'Clique em Iniciar e siga os passos informando o serviço e seu CPF.'],
            ['pergunta' => 'Como gerar minha senha?', 'resposta' => 'Clique em Iniciar e siga os passos informando o serviço e seu CPF.'],
            ['pergunta' => 'O que é uma senha prioritária?', 'resposta' => 'É uma senha que tem prioridade no atendimento, geralmente para pessoas com necessidades especiais ou idosos.'],
            ['pergunta' => 'Como posso acompanhar minha senha?', 'resposta' => 'Você pode acompanhar sua senha na tela principal do sistema, onde serão exibidas as senhas em atendimento.'],
            ['pergunta' => 'O que fazer se minha senha não for chamada?', 'resposta' => 'Se sua senha não for chamada dentro de um tempo razoável, você pode procurar o atendente para verificar a situação.'],
            ['pergunta' => 'Posso cancelar minha senha?', 'resposta' => 'Sim, você pode cancelar sua senha a qualquer momento antes de ser atendido.'],
        ];

        return Inertia::render('Senha/PerguntasFrequentes', [
            'perguntasFrequentes' => $perguntasFrequentes,
        ]);
    }

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
            $numero = intval(substr($ultimo->codigo, strpos($ultimo->codigo, '-') + 1));
            $next   = $numero + 1;
        } else {
            $next = 1;
        }

        $seq    = str_pad($next, 3, '00', STR_PAD_LEFT);
        $codigo = "{$prefix}-{$seq}";

        while (true) {
            try {
                $senha = Senha::create([
                    'cpf'                 => $data['cpf'],
                    'codigo'              => $codigo,
                    'prioridade'          => 'baixa',
                    'status'              => 'aguardando',
                    'tipo_atendimento_id' => $tipo->id,
                    'public_token'        => Senha::generateUniquePublicToken(),
                ]);
                break;
            } catch (\Illuminate\Database\QueryException $e) {
                if ($e->getCode() !== '23000') {
                    throw $e;
                }
            }
        }

        SenhaCriada::dispatch($senha);

        return redirect()->route('senhas.show', $senha);
    }

    public function telao()
    {
        $senhasAtendidas = Senha::with('tipoAtendimento')
            ->where('status', 'atendendo')
            ->orWhere('status', 'atendida')
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Senha/Telao', [
            'senhasAtendidas' => $senhasAtendidas,
        ]);
    }

    public function chamar(Request $request)
    {
        $guiche = (int) $request->input('guiche');

        $senha = DB::transaction(function () use ($guiche) {
            $tipoIds = TipoAtendimento::where('guiche', $guiche)->pluck('id');

            $senha = Senha::whereIn('tipo_atendimento_id', $tipoIds)
                ->where('status', 'aguardando')
                ->orderBy('created_at')
                ->lockForUpdate()
                ->firstOrFail();

            $senha->update([
                'status' => 'atendendo',
                'inicio_atendimento' => Carbon::now(),
            ]);

            return $senha;
        });
        
        $senha->load('tipoAtendimento');
        SenhaAtualizada::dispatch($senha);

        return redirect()->route('guiche.panel', ['guiche' => $guiche]);
    }

    public function finalizar(Request $request, Senha $senha)
    {
        $timezone = 'America/Sao_Paulo';

        $now = Carbon::now($timezone);
        $inicio = Carbon::parse($senha->inicio_atendimento)->setTimezone($timezone);

        $diff = abs((int) $now->diffInSeconds($inicio, false));

        $senha->update([
            'status' => 'atendida',
            'tempo_atendimento' => $diff,
        ]);

        $guiche = $request->input('guiche');

        if (!$guiche) {
            $senha->load('tipoAtendimento');
            $guiche = $senha->tipoAtendimento->guiche;
        }

        return redirect()->route('guiche.panel', ['guiche' => $guiche]);
    }

     public function cancelar(Request $request, Senha $senha)
    {
        $senha->update(['status' => 'cancelada']);

        $guiche = $request->input('guiche');
        if (!$guiche) {
            $senha->load('tipoAtendimento');
            $guiche = $senha->tipoAtendimento->guiche;
        }

        return redirect()->route('guiche.panel', ['guiche' => $guiche]);
    }

    public function chamarSenha(Request $request, Senha $senha)
    {
        $guiche = (int) $request->input('guiche');

        DB::transaction(function () use ($senha) {
            if ($senha->status !== 'aguardando') {
                abort(400, 'Senha indisponivel');
            }

            $senha->update([
                'status' => 'atendendo',
                'inicio_atendimento' => Carbon::now(),
            ]);
        });

        $senha->load('tipoAtendimento');
        SenhaAtualizada::dispatch($senha);

        return redirect()->route('guiche.panel', ['guiche' => $guiche]);
    }

    public function ticketVirtual(string $token)
    {
        $senha = Senha::where('public_token', $token)->firstOrFail();

        return Inertia::render('Senha/TicketVirtual', [
            'senha' => [
                'tipo'   => $senha->tipoAtendimento->nome,
                'cpf'    => $senha->cpf,
                'codigo' => $senha->codigo,
                'created_at' => $senha->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }
   
}
