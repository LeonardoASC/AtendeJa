<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitação #{{ $solicitacao->id }}</title>
    <style>
        @page {
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Serif', 'Times New Roman', serif;
            font-size: 11px;
            line-height: 1.7;
            color: #2d1810;
            background: linear-gradient(135deg, #f4e9d8 0%, #e8d7b8 50%, #f4e9d8 100%);
            position: relative;
            padding: 0;
            margin: 0;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.04) 0%, transparent 50%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.02) 2px, rgba(139, 69, 19, 0.02) 4px);
            opacity: 0.6;
            pointer-events: none;
        }

        .page-container {
            position: relative;
            padding: 25px;
            min-height: 100vh;
        }

        .ornate-border {
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 3px double #8b4513;
            box-shadow:
                inset 0 0 0 1px #d4a574,
                inset 0 0 0 8px #f4e9d8,
                inset 0 0 0 9px #8b4513,
                0 2px 8px rgba(139, 69, 19, 0.3);
        }

        .ornate-border::before,
        .ornate-border::after {
            content: '';
            position: absolute;
            background: #8b4513;
        }

        .ornate-border::before {
            top: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 6px;
            border-radius: 3px;
        }

        .ornate-border::after {
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 6px;
            border-radius: 3px;
        }

        .corner-ornament {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 2px solid #8b4513;
        }

        .corner-ornament.top-left {
            top: -2px;
            left: -2px;
            border-right: none;
            border-bottom: none;
        }

        .corner-ornament.top-right {
            top: -2px;
            right: -2px;
            border-left: none;
            border-bottom: none;
        }

        .corner-ornament.bottom-left {
            bottom: -2px;
            left: -2px;
            border-right: none;
            border-top: none;
        }

        .corner-ornament.bottom-right {
            bottom: -2px;
            right: -2px;
            border-left: none;
            border-top: none;
        }

        .content {
            position: relative;
            z-index: 1;
            padding: 15px 25px;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid #8b4513;
            position: relative;
        }

        .header::after {
            content: '◆';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: #f4e9d8;
            color: #8b4513;
            font-size: 18px;
            padding: 0 10px;
        }

        .seal {
            position: absolute;
            top: 10px;
            right: 25px;
            width: 60px;
            height: 60px;
            border: 3px solid #8b4513;
            border-radius: 50%;
            background: radial-gradient(circle, #d4a574 0%, #c19a6b 50%, #8b4513 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0 4px 10px rgba(139, 69, 19, 0.4);
            transform: rotate(-15deg);
        }

        .seal-text {
            color: #f4e9d8;
            font-size: 7px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            line-height: 1.2;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .seal-number {
            color: #f4e9d8;
            font-size: 12px;
            font-weight: bold;
            margin-top: 5px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .header h1 {
            font-size: 20px;
            color: #5d2e0f;
            margin-bottom: 4px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);
        }

        .header .subtitle {
            font-size: 11px;
            color: #8b4513;
            font-style: italic;
            margin-bottom: 8px;
        }

        .header .document-type {
            font-size: 11px;
            color: #6b4423;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 10px;
        }

        .divider {
            text-align: center;
            margin: 10px 0;
            color: #8b4513;
            font-size: 12px;
        }

        .divider::before,
        .divider::after {
            content: '═══════';
            margin: 0 15px;
        }

        .two-column-layout {
            display: table;
            width: 100%;
            margin-bottom: 12px;
        }

        .column-left {
            display: table-cell;
            width: 30%;
            padding-right: 15px;
            vertical-align: top;
        }

        .column-right {
            display: table-cell;
            width: 70%;
            vertical-align: top;
        }

        .info-section {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }

        .info-section h2 {
            font-size: 12px;
            color: #5d2e0f;
            margin-bottom: 10px;
            padding: 5px 10px;
            background: linear-gradient(90deg, rgba(139, 69, 19, 0.15) 0%, transparent 100%);
            border-left: 4px solid #8b4513;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 10px;
            border-collapse: separate;
            border-spacing: 0 5px;
        }

        .info-row {
            display: table-row;
        }

        .info-label {
            display: table-cell;
            font-weight: 700;
            color: #5d2e0f;
            padding: 6px 10px 6px 8px;
            width: 35%;
            vertical-align: top;
            background: rgba(139, 69, 19, 0.08);
            border-left: 3px solid #8b4513;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-value {
            display: table-cell;
            padding: 6px 8px 6px 10px;
            color: #2d1810;
            vertical-align: top;
            background: rgba(244, 233, 216, 0.6);
            border-right: 1px solid rgba(139, 69, 19, 0.2);
            font-size: 11px;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border: 2px solid;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
        }

        .status-badge::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -15px;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .status-pendente {
            background-color: rgba(218, 165, 32, 0.2);
            color: #8b6914;
            border-color: #8b6914;
        }

        .status-pendente::before {
            background-color: #daa520;
        }

        .status-enviado {
            background-color: rgba(34, 139, 34, 0.15);
            color: #1b5e1b;
            border-color: #228b22;
        }

        .status-enviado::before {
            background-color: #228b22;
        }

        .signature-section,
        .photo-section {
            margin-top: 12px;
            page-break-inside: avoid;
        }

        .signature-section h2,
        .photo-section h2 {
            font-size: 12px;
            color: #5d2e0f;
            margin-bottom: 10px;
            padding: 5px 10px;
            background: linear-gradient(90deg, rgba(139, 69, 19, 0.15) 0%, transparent 100%);
            border-left: 4px solid #8b4513;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .signature-box,
        .photo-box {
            border: 2px solid #8b4513;
            padding: 10px;
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(244, 233, 216, 0.4) 100%),
                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139, 69, 19, 0.03) 10px, rgba(139, 69, 19, 0.03) 20px);
            text-align: center;
            box-shadow:
                inset 0 0 0 1px rgba(139, 69, 19, 0.2),
                0 3px 8px rgba(139, 69, 19, 0.2);
            position: relative;
        }

        .signature-box::before,
        .photo-box::before {
            content: '';
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            /* border: 1px solid rgba(139, 69, 19, 0.3); */
        }

        .signature-box img {
            max-height: 70px;
            max-width: 100%;
            position: relative;
            z-index: 1;
        }

        .photo-box img {
            max-height: 150px;
            max-width: 100%;
            border: 2px solid #8b4513;
            box-shadow: 0 2px 6px rgba(139, 69, 19, 0.3);
            position: relative;
            z-index: 1;
        }

        .footer {
            margin-top: 15px;
            padding-top: 12px;
            border-top: 2px solid #8b4513;
            text-align: center;
            font-size: 9px;
            color: #6b4423;
            position: relative;
        }

        .footer::before {
            content: '◆';
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: #f4e9d8;
            color: #8b4513;
            font-size: 18px;
            padding: 0 10px;
        }

        .footer p {
            margin: 5px 0;
            font-style: italic;
        }

        .dados-formulario {
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(244, 233, 216, 0.3) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(139, 69, 19, 0.02) 20px, rgba(139, 69, 19, 0.02) 40px);
            padding: 10px;
            border: 2px solid #8b4513;
            box-shadow: inset 0 0 0 1px rgba(139, 69, 19, 0.2);
        }

        .dados-formulario-item {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed rgba(139, 69, 19, 0.3);
            position: relative;
            padding-left: 15px;
        }

        .dados-formulario-item::before {
            content: '▸';
            position: absolute;
            left: 0;
            top: 15px;
            color: #8b4513;
            font-size: 10px;
        }

        .dados-formulario-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .dados-formulario-label {
            font-weight: 700;
            color: #5d2e0f;
            font-size: 10px;
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
        }

        .dados-formulario-value {
            color: #2d1810;
            font-size: 11px;
            line-height: 1.6;
        }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(139, 69, 19, 0.05);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 10px;
            pointer-events: none;
            z-index: 0;
        }
    </style>
</head>

<body>
    <div class="watermark">{{ $solicitacao->tipoAtendimento->nome ?? 'Tipo não especificado' }}</div>

    <div class="page-container">
        <div class="ornate-border">
            <div class="corner-ornament top-left"></div>
            <div class="corner-ornament top-right"></div>
            <div class="corner-ornament bottom-left"></div>
            <div class="corner-ornament bottom-right"></div>
        </div>

        <div class="content">
            <div class="seal">
                <div class="seal-text">Documento<br>Oficial</div>
                <div class="seal-number">#{{ $solicitacao->id }}</div>
            </div>

            <div class="header">
                <div class="document-type">◈ Documento Oficial de Solicitação ◈</div>
                <h1>Solicitação Nº {{ str_pad($solicitacao->id, 6, '0', STR_PAD_LEFT) }}</h1>
                <div class="subtitle">{{ $solicitacao->tipoAtendimento->nome ?? 'Tipo não especificado' }}</div>
            </div>

            <div class="divider">◆</div>

            <div class="info-section">
                <h2>Dados do Solicitante</h2>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Nome Completo:</div>
                        <div class="info-value">{{ $solicitacao->nome }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">CPF:</div>
                        <div class="info-value">
                            {{ substr($solicitacao->cpf, 0, 3) }}.{{ substr($solicitacao->cpf, 3, 3) }}.{{ substr($solicitacao->cpf, 6, 3) }}-{{ substr($solicitacao->cpf, 9, 2) }}
                        </div>
                    </div>
                    @if ($solicitacao->email)
                        <div class="info-row">
                            <div class="info-label">Correio Eletrônico:</div>
                            <div class="info-value">{{ $solicitacao->email }}</div>
                        </div>
                    @endif
                    @if ($solicitacao->telefone)
                        <div class="info-row">
                            <div class="info-label">Telefone:</div>
                            <div class="info-value">{{ $solicitacao->telefone }}</div>
                        </div>
                    @endif
                    @if ($solicitacao->matricula)
                        <div class="info-row">
                            <div class="info-label">Matrícula:</div>
                            <div class="info-value">{{ $solicitacao->matricula }}</div>
                        </div>
                    @endif
                </div>
            </div>

            <div class="divider">◆</div>

            <div class="two-column-layout">
                <div class="column-left">
                    <div class="info-section">
                        <h2>Informações da Solicitação</h2>
                        <div class="info-grid">
                            <div class="info-row">
                                <div class="info-label">Data e Hora:</div>
                                <div class="info-value">{{ $solicitacao->created_at->format('d/m/Y H:i:s') }}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Situação:</div>
                                <div class="info-value">
                                    <span class="status-badge status-{{ $solicitacao->status }}">
                                        {{ $solicitacao->status === 'pendente' ? 'Pendente' : '✓ Enviado' }}
                                    </span>
                                </div>
                            </div>
                            @if ($solicitacao->admin)
                                <div class="info-row">
                                    <div class="info-label">Atendido por:</div>
                                    <div class="info-value">{{ $solicitacao->admin->name }}</div>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>

                @if ($solicitacao->foto)
                    <div class="column-right">
                        <div class="info-section">
                            <h2>Fotografia do Solicitante</h2>
                            <div class="photo-box">
                                <img src="{{ public_path('storage/' . $solicitacao->foto) }}"
                                    alt="Foto do solicitante">
                            </div>
                        </div>
                    </div>
                @endif
            </div>

            @if ($solicitacao->dados_formulario && count((array) $solicitacao->dados_formulario) > 0)
                <div class="divider">◆</div>

                <div class="info-section">
                    <h2>⚜ Dados do Formulário</h2>
                    <div class="dados-formulario">
                        @foreach ($solicitacao->dados_formulario as $key => $value)
                            <div class="dados-formulario-item">
                                <div class="dados-formulario-label">{{ $key }}:</div>
                                <div class="dados-formulario-value">{{ $value ?: '-' }}</div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            @if ($solicitacao->assinatura)
                <div class="divider">◆</div>

                <div class="signature-section">
                    <h2>⚜ Assinatura Digital do Solicitante</h2>
                    <div class="signature-box">
                        <img src="{{ $solicitacao->assinatura }}" alt="Assinatura">
                    </div>
                </div>
            @endif

            <div class="footer">
                <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
                <p>Documento gerado eletronicamente em {{ date('d/m/Y') }} às {{ date('H:i:s') }}</p>
                <p>Este é um documento oficial da Solicitação #{{ str_pad($solicitacao->id, 6, '0', STR_PAD_LEFT) }}
                </p>
                <p>A autenticidade deste documento pode ser verificada através do número de protocolo acima</p>
                <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            </div>
        </div>
    </div>
</body>

</html>
