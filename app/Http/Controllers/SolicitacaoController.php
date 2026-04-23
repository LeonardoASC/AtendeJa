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
use Illuminate\Support\Facades\Mail;
use App\Mail\SolicitacaoConfirmadaMail;
use Illuminate\Support\Str;

class SolicitacaoController extends Controller
{
    /**
     * Exibe a página para selecionar o tipo de solicitação
     */
    public function index()
    {
        $tiposAtendimento = TipoAtendimento::comFormulario()
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

        if (empty($validated['email'])) {
            return back()->withErrors([
                'email' => 'E-mail não cadastrado. Por favor, dirija-se à recepção para realizar a atualização cadastral antes de fazer a solicitação.'
            ])->withInput();
        }

        session(['dados_solicitacao' => $validated]);

        $tipoAtendimento = TipoAtendimento::find($validated['tipo_atendimento_id']);

        if ($this->deveExibirEtapaDadosApi($tipoAtendimento)) {
            return redirect()->route('solicitacoes.dados-api.form');
        }

        return redirect()->route('solicitacoes.assinar.form');
    }

    public function dadosApiForm()
    {
        $dadosSolicitacao = session('dados_solicitacao');

        if (!$dadosSolicitacao) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Sessão expirada. Por favor, preencha o formulário novamente.');
        }

        $tipoAtendimento = TipoAtendimento::find($dadosSolicitacao['tipo_atendimento_id']);

        if (!$this->deveExibirEtapaDadosApi($tipoAtendimento)) {
            return redirect()->route('solicitacoes.assinar.form');
        }

        return Inertia::render('Solicitacao/DadosApi', [
            'dadosSolicitacao' => $dadosSolicitacao,
            'tipoAtendimento' => $tipoAtendimento,
        ]);
    }

    public function dadosApiStore()
    {
        $dadosSolicitacao = session('dados_solicitacao');

        if (!$dadosSolicitacao) {
            return redirect()->route('solicitacoes.index')
                ->with('error', 'Sessão expirada. Por favor, preencha o formulário novamente.');
        }

        $validated = request()->validate([
            'recadastramento' => 'nullable|array',
            'recadastramento.alteracoesCampos' => 'nullable|array',
            'recadastramento.novosDependentes' => 'nullable|array',
            'recadastramento.dependentesParaRemover' => 'nullable|array',
            'recadastramento.resumo' => 'nullable|array',
        ]);

        $dadosSolicitacao['recadastramento'] = $validated['recadastramento'] ?? [
            'alteracoesCampos' => [],
            'novosDependentes' => [],
            'dependentesParaRemover' => [],
            'resumo' => [
                'totalCamposAlterados' => 0,
                'totalNovosDependentes' => 0,
                'totalDependentesParaRemover' => 0,
            ],
        ];

        session(['dados_solicitacao' => $dadosSolicitacao]);

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

    private function deveExibirEtapaDadosApi(?TipoAtendimento $tipoAtendimento): bool
    {
        $nomeTipo = $this->normalizarIdentificadorTipo($tipoAtendimento?->nome);
        $nomeAlvo = $this->normalizarIdentificadorTipo('RECADASTRAMENTO / PROVA DE VIDA');

        return $nomeTipo === $nomeAlvo;
    }

    private function normalizarIdentificadorTipo(?string $nome): string
    {
        $normalizado = Str::upper(Str::ascii(trim((string) $nome)));

        // Remove separadores e pontuação para comparar apenas conteúdo semântico.
        return preg_replace('/[^A-Z0-9]+/', '', $normalizado) ?? '';
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
            $tipoAtendimento = TipoAtendimento::find($dadosSolicitacao['tipo_atendimento_id']);
            $isRecadastramento = $this->deveExibirEtapaDadosApi($tipoAtendimento);

            $pdfPath = $isRecadastramento
                ? $this->gerarPdfRecadastramentoAnexo($dadosSolicitacao)
                : $this->gerarPdfAnexo($dadosSolicitacao);

            $dadosFormulario = $dadosSolicitacao['dados_formulario'] ?? [];
            if (!is_array($dadosFormulario)) {
                $dadosFormulario = [];
            }

            if (!empty($dadosSolicitacao['recadastramento'])) {
                $dadosFormulario['_recadastramento'] = $dadosSolicitacao['recadastramento'];
            }

            $solicitacao = Solicitacao::create([
                'tipo_atendimento_id' => $dadosSolicitacao['tipo_atendimento_id'],
                'nome' => $dadosSolicitacao['nome'],
                'cpf' => $dadosSolicitacao['cpf'],
                'email' => $dadosSolicitacao['email'] ?? null,
                'matricula' => $dadosSolicitacao['matricula'] ?? null,
                'telefone' => $dadosSolicitacao['telefone'] ?? null,
                'dados_formulario' => $dadosFormulario,
                'anexo' => $pdfPath,
                'status' => 'pendente',
            ]);

            OpenOneDocProtocolJob::dispatch($solicitacao->id);

            if (!empty($solicitacao->email)) {
                $solicitacao->load('tipoAtendimento');
                Mail::to($solicitacao->email)->send(new SolicitacaoConfirmadaMail($solicitacao));
            }

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

    public function atenderSolicitacao(Request $request)
    {
        $filtros = [
            'busca' => trim((string) $request->query('busca', '')),
            'tipo_atendimento_id' => $request->query('tipo_atendimento_id'),
            'data_inicio' => $request->query('data_inicio'),
            'data_fim' => $request->query('data_fim'),
        ];

        $consultaBase = Solicitacao::with(['tipoAtendimento', 'admin'])
            ->when($filtros['busca'] !== '', function ($query) use ($filtros) {
                $termo = $filtros['busca'];

                $query->where(function ($subQuery) use ($termo) {
                    $subQuery->where('nome', 'like', "%{$termo}%")
                        ->orWhere('cpf', 'like', "%{$termo}%")
                        ->orWhere('matricula', 'like', "%{$termo}%")
                        ->orWhere('email', 'like', "%{$termo}%");
                });
            })
            ->when(!empty($filtros['tipo_atendimento_id']), function ($query) use ($filtros) {
                $query->where('tipo_atendimento_id', $filtros['tipo_atendimento_id']);
            })
            ->when(!empty($filtros['data_inicio']), function ($query) use ($filtros) {
                $query->whereDate('created_at', '>=', $filtros['data_inicio']);
            })
            ->when(!empty($filtros['data_fim']), function ($query) use ($filtros) {
                $query->whereDate('created_at', '<=', $filtros['data_fim']);
            });

        $solicitacoesPendentes = (clone $consultaBase)
            ->where('status', 'pendente')
            ->whereNotNull('onedoc_error')
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'pendentes_page')
            ->withQueryString();

        $solicitacoesEnviadas = (clone $consultaBase)
            ->where('status', 'enviado')
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'enviadas_page')
            ->withQueryString();

        $tiposAtendimento = TipoAtendimento::comFormulario()
            ->orderBy('nome')
            ->get(['id', 'nome']);

        $filaJobs = app('queue')->size();

        return Inertia::render('Autenticado/Solicitacao/Index', [
            'solicitacoesPendentes' => $solicitacoesPendentes,
            'solicitacoesEnviadas' => $solicitacoesEnviadas,
            'tiposAtendimento' => $tiposAtendimento,
            'filtros' => $filtros,
            'filaJobs' => $filaJobs,
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

    private function gerarPdfRecadastramentoAnexo(array $dados): string
    {
        $recadastramento = $dados['recadastramento'] ?? null;
        if (!is_array($recadastramento)) {
            $recadastramento = [];
        }

        $alteracoesCampos = $recadastramento['alteracoesCampos'] ?? [];
        $novosDependentes = $recadastramento['novosDependentes'] ?? [];
        $dependentesParaRemover = $recadastramento['dependentesParaRemover'] ?? [];

        $pdf = Pdf::loadView('relatorios.solicitacao-recadastramento', [
            'dadosBasicos' => [
                'nome' => $dados['nome'] ?? '',
                'email' => $dados['email'] ?? '',
                'cpf' => $dados['cpf'] ?? '',
                'telefone' => $dados['telefone'] ?? '',
            ],
            'alteracoesCampos' => is_array($alteracoesCampos) ? $alteracoesCampos : [],
            'novosDependentes' => is_array($novosDependentes) ? $novosDependentes : [],
            'dependentesParaRemover' => is_array($dependentesParaRemover) ? $dependentesParaRemover : [],
            'geradoEm' => now(),
        ]);

        $pdf->setPaper('a4', 'portrait');

        $filename = 'solicitacao-recadastramento-' . time() . '-' . uniqid() . '.pdf';
        $path = 'SolicitacaoAnexos/' . $filename;

        Storage::disk('public')->put($path, $pdf->output());

        return $path;
    }
}
