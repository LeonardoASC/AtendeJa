<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $isRecadastramento ? 'Confirmacao de Recadastramento / Prova de Vida' : 'Confirmacao de Solicitacao' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
        }

        .footer {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            font-size: 0.9em;
            color: #6c757d;
        }

        h1 {
            color: #0056b3;
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            margin-bottom: 15px;
        }

        .info {
            background-color: #e7f3ff;
            padding: 15px;
            border-left: 4px solid #0056b3;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>{{ $isRecadastramento ? 'Confirmacao de Recadastramento / Prova de Vida' : 'Confirmacao de Solicitacao' }}</h1>
    </div>

    <div class="content">
        <p>Prezado(a) servidor(a), {{ $solicitacao->nome }}</p>

        @if ($isRecadastramento)
            <p>Informamos que sua solicitacao de recadastramento / prova de vida foi registrada com sucesso em nosso sistema.</p>
            <p>Os dados enviados serao analisados e processados pela equipe responsavel.</p>
            <p>Se for identificada alguma pendencia ou necessidade de complemento de informacoes, voce sera contatado pelos canais cadastrados.</p>
            <p>Recomendamos acompanhar eventuais comunicacoes pelos canais oficiais.</p>
        @else
            <p>Informamos que sua solicitacao de adiantamento da primeira parcela do 13o salario foi registrada com sucesso em nosso sistema.</p>
            <p>Nos casos em que nao houver nenhuma pendencia, a solicitacao e aprovada automaticamente e o valor sera creditado na proxima folha de pagamento, conforme os prazos estabelecidos pela instituicao.</p>
            <p>Caso seja identificada qualquer inconsistencia ou impedimento, o setor de Recursos Humanos entrara em contato para prestar os devidos esclarecimentos.</p>
            <p>Recomendamos acompanhar eventuais comunicacoes pelos canais oficiais.</p>
        @endif

        <div class="info">
            <strong>Dados da Solicitacao:</strong><br>
            <strong>Protocolo:</strong> #{{ $solicitacao->id }}<br>
            <strong>Nome:</strong> {{ $solicitacao->nome }}<br>
            <strong>Servico:</strong> {{ $solicitacao->tipoAtendimento->nome ?? '-' }}<br>
            <strong>Data:</strong> {{ $solicitacao->created_at->format('d/m/Y H:i') }}
        </div>
    </div>

    <div class="footer">
        <p><em>Este e um e-mail automatico. Por favor, nao responda.</em></p>
    </div>
</body>

</html>
