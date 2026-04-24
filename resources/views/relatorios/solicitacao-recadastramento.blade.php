<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recadastramento - Alteracoes</title>
    <style>
        @page {
            margin: 20px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #000;
            background: #fff;
            padding: 40px 60px;
        }

        .document-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #038845;
            padding: 20px 30px;
        }

        .logo-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .document-title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin: 30px 0 20px 0;
            text-transform: uppercase;
        }

        .document-meta {
            margin: 20px 0;
            font-size: 12px;
        }

        .section-title {
            font-size: 13px;
            font-weight: bold;
            margin: 24px 0 10px;
            text-transform: uppercase;
        }

        .document-body {
            text-align: justify;
            margin: 25px 0;
            line-height: 1.8;
        }

        .document-body p {
            margin-bottom: 12px;
        }

        .underline-text {
            text-decoration: underline;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
            word-break: break-word;
        }

        th {
            background: #f2f2f2;
            text-align: left;
            font-weight: bold;
        }

        .empty-state {
            margin-top: 8px;
        }

        .dependente-title {
            font-size: 12px;
            font-weight: bold;
            margin: 14px 0 6px;
        }

        .helper-text {
            margin-top: 6px;
            color: #444;
        }

        ul {
            margin: 8px 0 0 18px;
            padding: 0;
        }

        li {
            margin-bottom: 6px;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            color: #666;
            margin-top: 20px;
        }

        .signature-line {
            margin: 30px auto 20px auto;
            max-width: 350px;
        }

        .signature-line-border {
            border-top: 1px solid #000;
            padding-top: 5px;
            text-align: center;
            font-size: 12px;
        }

        .photo-container {
            border: 1px solid #000;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9f9f9;
            margin-top: 20px;
        }

        .photo-container img {
            max-width: 100%;
            max-height: 200px;
        }

        .photo-placeholder {
            font-size: 16px;
            color: #999;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="document-container">
        <div class="logo-header">
            <img src="{{ public_path('images/logoPrevmocHorizontal_400x120.png') }}" alt="Logo PREVMOC"
                style="max-height: 40px; opacity: 0.6;">
        </div>

        <div class="document-title">
            REQUERIMENTO - RECADASTRAMENTO / PROVA DE VIDA
        </div>

        <div class="document-meta">
            Documento gerado em:
            <span class="underline-text">{{ $geradoEm->format('d/m/Y H:i') }}</span>
        </div>

        <div class="document-body">
            <p>
                Este documento apresenta os dados basicos do solicitante e o resumo das alteracoes informadas no fluxo
                de recadastramento / prova de vida.
            </p>
        </div>

        <div class="section-title">Dados Basicos</div>
        <table>
            <tbody>
                <tr>
                    <th style="width: 25%;">Nome</th>
                    <td>{{ $dadosBasicos['nome'] ?: '-' }}</td>
                </tr>
                <tr>
                    <th>E-mail</th>
                    <td>{{ $dadosBasicos['email'] ?: '-' }}</td>
                </tr>
                <tr>
                    <th>CPF</th>
                    <td>{{ $dadosBasicos['cpf'] ?: '-' }}</td>
                </tr>
                <tr>
                    <th>Telefone</th>
                    <td>{{ $dadosBasicos['telefone'] ?: '-' }}</td>
                </tr>
                <tr>
                    <th>Matricula</th>
                    <td>{{ $dadosBasicos['matricula'] ?: '-' }}</td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">Alteracoes de Dados Pessoais - ({{ $dadosBasicos['nome'] ?: '-' }})</div>
        @if (!empty($alteracoesDadosPessoais))
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%;">Campo</th>
                        <th style="width: 37.5%;">Valor anterior</th>
                        <th style="width: 37.5%;">Valor novo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($alteracoesDadosPessoais as $alteracao)
                        <tr>
                            <td>{{ $alteracao['campo'] ?? ($alteracao['chave'] ?? '-') }}</td>
                            <td>{{ $alteracao['valorAnterior'] ?? '-' }}</td>
                            <td>{{ $alteracao['valorNovo'] ?? '-' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="empty-state">Nenhuma alteracao de dados pessoais.</p>
        @endif

        <div class="section-title">Alteracoes nos Dados dos Dependentes</div>
        @if (!empty($alteracoesDependentesAgrupadas))
            <p class="helper-text">
                Abaixo estao separadas, por dependente, as informacoes que foram revisadas ou alteradas.
            </p>
            @foreach ($alteracoesDependentesAgrupadas as $grupoDependente)
                <div class="dependente-title">
                    {{ $grupoDependente['titulo'] }}
                    @if (!empty($grupoDependente['nome']))
                        - {{ $grupoDependente['nome'] }}
                    @endif
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Campo alterado</th>
                            <th style="width: 37.5%;">Como estava antes</th>
                            <th style="width: 37.5%;">Como ficou informado</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($grupoDependente['alteracoes'] as $alteracao)
                            <tr>
                                <td>{{ $alteracao['campo'] ?? ($alteracao['chave'] ?? '-') }}</td>
                                <td>{{ $alteracao['valorAnterior'] ?? '-' }}</td>
                                <td>{{ $alteracao['valorNovo'] ?? '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endforeach
        @else
            <p class="empty-state">Nenhuma alteracao em dados de dependentes.</p>
        @endif

        <div class="section-title">Inclusao de Novos Dependentes</div>
        @if (!empty($novosDependentes))
            @foreach ($novosDependentes as $index => $dependente)
                <div class="dependente-title">Dependente {{ $index + 1 }}</div>
                <table>
                    <tbody>
                        @foreach ($dependente as $chave => $valor)
                            @if ($chave !== 'id')
                                <tr>
                                    <th style="width: 25%;">{{ $chave }}</th>
                                    <td>{{ is_scalar($valor) ? $valor : json_encode($valor) }}</td>
                                </tr>
                            @endif
                        @endforeach
                    </tbody>
                </table>
            @endforeach
        @else
            <p class="empty-state">Nenhum novo dependente incluido.</p>
        @endif

        <div class="section-title">Exclusao de Dependentes</div>
        @if (!empty($dependentesParaRemover))
            <ul>
                @foreach ($dependentesParaRemover as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ul>
        @else
            <p class="empty-state">Nenhum dependente marcado para remocao.</p>
        @endif

        @if ($assinatura)
            <div class="signature-line">
                <div style="text-align: center; margin-bottom: 10px;">
                    <img src="{{ $assinatura }}" alt="Assinatura" style="max-height: 60px;">
                </div>
                <div class="signature-line-border">
                    {{ $dadosBasicos['nome'] ?: 'Assinatura do solicitante' }}
                </div>
            </div>
        @else
            <div class="signature-line">
                <div class="signature-line-border">
                    {{ $dadosBasicos['nome'] ?: 'Assinatura do solicitante' }}
                </div>
            </div>
        @endif

        @if ($foto)
            <div class="photo-container">
                <img src="{{ $foto }}" alt="Foto do solicitante">
            </div>
        @else
            <div class="photo-container">
                <div class="photo-placeholder">[FOTO]</div>
            </div>
        @endif

        <footer class="footer">
            Av. Jose Correa Machado, 1380 - Jardim Sao Luiz, Montes Claros - MG, 39401-856<br>
            Telefone: (38) 2211-3880 | (38) 2211-3896
        </footer>
    </div>
</body>

</html>
