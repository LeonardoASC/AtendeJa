<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use App\Models\TipoAtendimento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Jobs\OpenOneDocProtocolJob;

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

        if ($validated['tipo_atendimento_id'] == 3 && empty($validated['email'])) {
            return back()->withErrors([
                'email' => 'E-mail não cadastrado. Por favor, dirija-se à recepção para realizar a atualização cadastral antes de fazer a solicitação.'
            ])->withInput();
        }

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

            $pdfPath = $this->gerarPdfAnexo($dadosSolicitacao);

            $solicitacao = Solicitacao::create([
                'tipo_atendimento_id' => $dadosSolicitacao['tipo_atendimento_id'],
                'nome' => $dadosSolicitacao['nome'],
                'cpf' => $dadosSolicitacao['cpf'],
                'email' => $dadosSolicitacao['email'] ?? null,
                'matricula' => $dadosSolicitacao['matricula'] ?? null,
                'telefone' => $dadosSolicitacao['telefone'] ?? null,
                'dados_formulario' => $dadosSolicitacao['dados_formulario'] ?? null,
                'anexo' => $pdfPath,
                'status' => 'pendente',
            ]);

            OpenOneDocProtocolJob::dispatch($solicitacao->id);

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
            'tipo_atendimento_id' => 'required|integer',
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'matricula' => 'nullable|string|max:50',
            'telefone' => 'nullable|string|max:30',
            'dados_formulario' => 'nullable|array',
            'observacoes' => 'nullable|string|max:1000',
            'assinatura' => 'required|string',
            'foto' => 'nullable',
        ]);

        try {

            if ($request->hasFile('foto')) {
                $fotoPath = $request->file('foto')->store('SolicitacaoFoto', 'public');
                $validated['foto'] = $fotoPath;
            }

            $pdfPath = $this->gerarPdfAnexo($validated);

            $solicitacao = Solicitacao::create([
                'tipo_atendimento_id' => (int) $validated['tipo_atendimento_id'],
                'nome' => $validated['nome'],
                'cpf' => preg_replace('/\D+/', '', $validated['cpf']),
                'email' => $validated['email'] ?? null,
                'matricula' => $validated['matricula'] ?? null,
                'telefone' => $validated['telefone'] ?? null,
                'dados_formulario' => $validated['dados_formulario'] ?? [],
                'observacoes' => $validated['observacoes'] ?? null,
                'anexo' => $pdfPath,
                'onedoc_status' => null,
            ]);

            OpenOneDocProtocolJob::dispatch($solicitacao->id);

            return response()->json([
                'success' => true,
                'solicitacao_id' => $solicitacao->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Erro ao criar solicitação', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar solicitação.',
                'error' => $e->getMessage(),
            ], 500);
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

    public function atenderSolicitacao()
    {
        $solicitacoesPendentes = Solicitacao::with(['tipoAtendimento', 'admin'])
            ->where('status', 'pendente')
            ->orderBy('created_at', 'desc')
            ->get();

        $solicitacoesEnviadas = Solicitacao::with(['tipoAtendimento', 'admin'])
            ->where('status', 'enviado')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Autenticado/Solicitacao/Index', [
            'solicitacoesPendentes' => $solicitacoesPendentes,
            'solicitacoesEnviadas' => $solicitacoesEnviadas,
        ]);
    }

    /**
     * Marca uma solicitação como enviada
     */
    public function marcarEnviado(Solicitacao $solicitacao)
    {
        $solicitacao->update([
            'status' => 'enviado',
            'admin_id' => auth('admin')->id(),
        ]);

        return redirect()->back()->with('success', 'Solicitação marcada como enviada.');
    }

    /**
     * Gera PDF da solicitação
     */
    public function gerarPdf(Solicitacao $solicitacao)
    {
        $solicitacao->load('tipoAtendimento', 'admin');

        $pdf = Pdf::loadView('relatorios.solicitacao', [
            'solicitacao' => $solicitacao
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('solicitacao-' . $solicitacao->id . '.pdf');
    }

    /**
     * Visualiza o PDF anexo da solicitação
     */
    public function visualizarPdf(Solicitacao $solicitacao)
    {
        if (!$solicitacao->anexo || !Storage::disk('public')->exists($solicitacao->anexo)) {
            abort(404, 'PDF não encontrado');
        }

        return response()->file(Storage::disk('public')->path($solicitacao->anexo));
    }

    private function gerarPdfAnexo(array $dados)
    {
        // Gera um ID temporário único baseado no timestamp
        $idTemp = 'SOL-' . date('YmdHis') . '-' . substr(uniqid(), -4);

        // Cria uma solicitação temporária para a view do PDF
        $solicitacaoTemp = (object) [
            'id' => $idTemp,
            'nome' => $dados['nome'],
            'cpf' => $dados['cpf'],
            'email' => $dados['email'] ?? null,
            'matricula' => $dados['matricula'] ?? null,
            'telefone' => $dados['telefone'] ?? null,
            'dados_formulario' => $dados['dados_formulario'] ?? [],
            'assinatura' => $dados['assinatura'],
            'foto' => $dados['foto'] ?? null,
            'status' => 'pendente',
            'created_at' => now(),
            'tipoAtendimento' => (object) [
                'nome' => TipoAtendimento::find($dados['tipo_atendimento_id'])->nome ?? 'N/A'
            ],
            'admin' => null,
        ];

        $pdf = Pdf::loadView('relatorios.solicitacao', [
            'solicitacao' => $solicitacaoTemp
        ]);

        $pdf->setPaper('a4', 'portrait');

        $filename = 'solicitacao-' . time() . '-' . uniqid() . '.pdf';
        $path = 'SolicitacaoAnexos/' . $filename;

        Storage::disk('public')->put($path, $pdf->output());

        return $path;
    }
}
