<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegistrarAvaliacaoRequest;
use App\Models\Avaliacao;
use App\Models\ServicoAvaliacao;
use Inertia\Inertia;

class AvaliacaoPublicaController extends Controller
{
    public function index()
    {
        $servicos = ServicoAvaliacao::query()
            ->where('ativo', true)
            ->orderBy('ordem')
            ->orderBy('nome')
            ->get(['id', 'nome', 'slug', 'descricao']);

        return Inertia::render('Avaliacao/Servicos', [
            'servicos' => $servicos,
        ]);
    }

    public function show(ServicoAvaliacao $servicoAvaliacao)
    {
        abort_unless($servicoAvaliacao->ativo, 404);

        return Inertia::render('Avaliacao/Publica', [
            'servico' => [
                'id' => $servicoAvaliacao->id,
                'nome' => $servicoAvaliacao->nome,
                'slug' => $servicoAvaliacao->slug,
                'descricao' => $servicoAvaliacao->descricao,
            ],
            'niveis' => [
                ['nota' => 1, 'rotulo' => 'Pessimo', 'icone' => ':(('],
                ['nota' => 2, 'rotulo' => 'Ruim', 'icone' => ':('],
                ['nota' => 3, 'rotulo' => 'Regular', 'icone' => ':|'],
                ['nota' => 4, 'rotulo' => 'Bom', 'icone' => ':)'],
                ['nota' => 5, 'rotulo' => 'Otimo', 'icone' => ':D'],
            ],
        ]);
    }

    public function store(RegistrarAvaliacaoRequest $request, ServicoAvaliacao $servicoAvaliacao)
    {
        abort_unless($servicoAvaliacao->ativo, 404);

        $dados = $request->validated();

        Avaliacao::create([
            'servico_avaliacao_id' => $servicoAvaliacao->id,
            'nota' => $dados['nota'],
            'comentario' => $dados['comentario'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 255),
        ]);

        return redirect()->route('avaliacoes.publico.sucesso', $servicoAvaliacao->slug);
    }

    public function sucesso(ServicoAvaliacao $servicoAvaliacao)
    {
        return Inertia::render('Avaliacao/Sucesso', [
            'servico' => [
                'nome' => $servicoAvaliacao->nome,
                'slug' => $servicoAvaliacao->slug,
            ],
            'redirectUrl' => '/admin/senhas',
        ]);
    }
}
