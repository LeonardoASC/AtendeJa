<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Solicitação</title>
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
        <h1>Confirmação de Solicitação</h1>
    </div>

    <div class="content">
        <p>Prezado(a) servidor(a), {{ $solicitacao->nome }}</p>
        <p>Informamos que sua solicitação de adiantamento da primeira parcela do 13º salário foi registrada com sucesso
            em nosso sistema.</p>
        <p>Nos casos em que não houver nenhuma pendência, a solicitação é aprovada automaticamente e o valor será
            creditado na próxima folha de pagamento, conforme os prazos estabelecidos pela instituição.</p>
        <p>Caso seja identificada qualquer inconsistência ou impedimento, o setor de Recursos Humanos entrará em contato
            para prestar os devidos esclarecimentos.</p>
        <p>Recomendamos acompanhar eventuais comunicações pelos canais oficiais.</p>
        <div class="info">
            <strong>Dados da Solicitação:</strong><br>
            <strong>Protocolo:</strong> #{{ $solicitacao->id }}<br>
            <strong>Nome:</strong> {{ $solicitacao->nome }}<br>
            <strong>Data:</strong> {{ $solicitacao->created_at->format('d/m/Y H:i') }}
        </div>
    </div>

    <div class="footer">
        <p><em>Este é um e-mail automático. Por favor, não responda.</em></p>
    </div>
</body>

</html>
