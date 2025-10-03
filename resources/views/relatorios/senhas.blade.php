<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Relatório de Senhas</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <h1>Relatório de Senhas</h1>
    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>CPF</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Guiche</th>
                <th>Atendente</th>
                <th>Criado em</th>
                <th>Tempo atendimento (s)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($senhas as $senha)
                <tr>
                    <td>{{ $senha->codigo }}</td>
                    <td>{{ $senha->cpf }}</td>
                    <td>{{ $senha->tipoAtendimento->nome ?? '' }}</td>
                    <td>{{ $senha->status }}</td>
                    <td>{{ $senha->guiche_id ?? '-' }}</td>
                    <td>{{ $senha->atendente_nome ?? 'Atendente' }}</td>
                    <td>{{ $senha->created_at->format('d/m/Y H:i') }}</td>
                    <td>{{ $senha->tempo_atendimento }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
