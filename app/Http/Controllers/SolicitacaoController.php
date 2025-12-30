<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use App\Models\TipoAtendimento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SolicitacaoController extends Controller
{
    /**
     * Exibe a página para selecionar o tipo de solicitação
     */
    public function index()
    {
        $tiposAtendimento = TipoAtendimento::where('tem_formulario', true)
            ->orderBy('nome')
            ->get();

        return Inertia::render('Solicitacao/Index', [
            'tiposAtendimento' => $tiposAtendimento,
        ]);
    }

    /**
     * Exibe o formulário específico para o tipo de solicitação selecionado
     */
    public function create(Request $request)
    {
        $tipoId = $request->query('tipo');

        if (!$tipoId) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Selecione um tipo de solicitação.');
        }

        $tipoAtendimento = TipoAtendimento::findOrFail($tipoId);

        // Verifica se o tipo tem formulário habilitado
        if (!$tipoAtendimento->tem_formulario) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Este tipo de atendimento não possui formulário de solicitação.');
        }

        return Inertia::render('Solicitacao/Formulario', [
            'tipoAtendimento' => $tipoAtendimento,
        ]);
    }

    /**
     * Salva os dados do formulário na sessão e redireciona para assinatura
     */
    public function formularioStore(Request $request)
    {
        $validated = $request->validate([
            'tipo_atendimento_id' => 'required|exists:tipo_atendimentos,id',
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|size:11',
            'email' => 'nullable|email|max:255',
            'matricula' => 'nullable|string|max:50',
            'telefone' => 'nullable|string|max:20',
            'dados_formulario' => 'nullable|array',
        ]);

        // Salvar na sessão
        session(['dados_solicitacao' => $validated]);

        return redirect()->route('solicitacoes.assinar.form');
    }

    /**
     * Processa a assinatura e salva na sessão
     */
    public function assinarStore(Request $request)
    {
        $validated = $request->validate([
            'tipo_atendimento_id' => 'required|exists:tipo_atendimentos,id',
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|size:11',
            'email' => 'nullable|email|max:255',
            'matricula' => 'nullable|string|max:50',
            'telefone' => 'nullable|string|max:20',
            'dados_formulario' => 'nullable|array',
            'assinatura' => 'required|string',
        ]);

        session(['dados_solicitacao' => $validated]);

        return redirect()->route('solicitacoes.foto.form');
    }

    public function assinarForm(Request $request)
    {
        $dadosSolicitacao = session('dados_solicitacao');

        if (!$dadosSolicitacao) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Sessão expirada. Por favor, preencha o formulário novamente.');
        }

        $tipoAtendimento = TipoAtendimento::find($dadosSolicitacao['tipo_atendimento_id']);

        return Inertia::render('Solicitacao/Assinatura', [
            'dadosSolicitacao' => $dadosSolicitacao,
            'tipoAtendimento' => $tipoAtendimento,
        ]);
    }

    /**
     * Exibe a página de foto
     */
    public function fotoForm(Request $request)
    {
        $dadosSolicitacao = session('dados_solicitacao');

        if (!$dadosSolicitacao) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Sessão expirada. Por favor, preencha o formulário novamente.');
        }

        $tipoAtendimento = TipoAtendimento::find($dadosSolicitacao['tipo_atendimento_id']);

        return Inertia::render('Solicitacao/Foto', [
            'dadosSolicitacao' => $dadosSolicitacao,
            'tipoAtendimento' => $tipoAtendimento,
        ]);
    }

    /**
     * Processa a foto e salva na sessão
     */
    public function fotoStore(Request $request)
    {
        $validated = $request->validate([
            'foto' => 'required|file|image|max:5120',
        ]);

        $dadosSolicitacao = session('dados_solicitacao');

        if (!$dadosSolicitacao) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Sessão expirada. Por favor, preencha o formulário novamente.');
        }

        $path = $request->file('foto')->store('SolicitacaoFoto', 'public');

        $dadosSolicitacao['foto'] = $path;
        session(['dados_solicitacao' => $dadosSolicitacao]);

        return redirect()->route('solicitacoes.finalizar');
    }

    /**
     * Finaliza a solicitação criando no banco
     */
    public function finalizar(Request $request)
    {
        $dadosSolicitacao = session('dados_solicitacao');

        if (!$dadosSolicitacao) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Sessão expirada. Por favor, preencha o formulário novamente.');
        }

        try {
            $solicitacao = Solicitacao::create([
                'tipo_atendimento_id' => $dadosSolicitacao['tipo_atendimento_id'],
                'nome' => $dadosSolicitacao['nome'],
                'cpf' => $dadosSolicitacao['cpf'],
                'email' => $dadosSolicitacao['email'] ?? null,
                'matricula' => $dadosSolicitacao['matricula'] ?? null,
                'telefone' => $dadosSolicitacao['telefone'] ?? null,
                'dados_formulario' => $dadosSolicitacao['dados_formulario'] ?? null,
                'assinatura' => $dadosSolicitacao['assinatura'],
                'foto' => $dadosSolicitacao['foto'] ?? null,
                'status' => 'pendente',
            ]);

            session()->forget('dados_solicitacao');

            return redirect()->route('solicitacoes.sucesso', ['solicitacao' => $solicitacao->id]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar solicitação', [
                'error' => $e->getMessage(),
                'data' => $dadosSolicitacao
            ]);

            return back()->withErrors(['error' => 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'])->withInput();
        }
    }

    /**
     * Armazena a solicitação no banco de dados (usado diretamente se necessário)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_atendimento_id' => 'required|exists:tipo_atendimentos,id',
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|size:11',
            'email' => 'nullable|email|max:255',
            'matricula' => 'nullable|string|max:50',
            'telefone' => 'nullable|string|max:20',
            'dados_formulario' => 'nullable|array',
            'assinatura' => 'required|string',
            'foto' => 'nullable|file|image|max:5120',
        ]);

        try {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $fotoPath = $request->file('foto')->store('SolicitacaoFoto', 'public');
            }

            $solicitacao = Solicitacao::create([
                'tipo_atendimento_id' => $validated['tipo_atendimento_id'],
                'nome' => $validated['nome'],
                'cpf' => $validated['cpf'],
                'email' => $validated['email'] ?? null,
                'matricula' => $validated['matricula'] ?? null,
                'telefone' => $validated['telefone'] ?? null,
                'dados_formulario' => $validated['dados_formulario'] ?? null,
                'assinatura' => $validated['assinatura'],
                'foto' => $fotoPath,
                'status' => 'pendente',
            ]);

            session()->forget('dados_solicitacao');

            return redirect()->route('solicitacoes.sucesso', ['solicitacao' => $solicitacao->id]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar solicitação', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return back()->withErrors(['error' => 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'])->withInput();
        }
    }

    /**
     * Exibe página de sucesso após criação da solicitação
     */
    public function sucesso(Solicitacao $solicitacao)
    {
        $solicitacao->load('tipoAtendimento');

        return Inertia::render('Solicitacao/Sucesso', [
            'solicitacao' => [
                'id' => $solicitacao->id,
                'tipo' => $solicitacao->tipoAtendimento->nome,
                'nome' => $solicitacao->nome,
                'status' => $solicitacao->status,
                'created_at' => $solicitacao->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }
}
