<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitação #{{ $solicitacao->id }}</title>
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

        .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #185ba8;
            margin-bottom: 5px;
        }

        .logo-subtitle {
            font-size: 10px;
            color: #666;
            line-height: 1.4;
        }

        .document-title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin: 30px 0 20px 0;
            text-transform: uppercase;
        }

        .solicitation-number {
            margin: 20px 0;
            font-size: 12px;
        }

        .document-body {
            text-align: justify;
            margin: 25px 0;
            line-height: 1.8;
        }

        .document-body p {
            margin-bottom: 15px;
        }

        .location-date {
            text-align: center;
            margin: 40px 0 60px 0;
        }

        .signature-line {
            margin: 0px auto 20px auto;
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
            /* margin: 30px 0; */
            background: #f9f9f9;
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

        .info-field {
            display: inline;
        }

        .underline-text {
            text-decoration: underline;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="document-container">
        <div class="logo-header">
            <img src="{{ public_path('images/logoPrevmocHorizontal_400x120.png') }}" alt="Logo PREVMOC" style="max-height: 40px; opacity: 0.6;">
        </div>

        <div class="document-title">
            REQUERIMENTO – {{ strtoupper($solicitacao->tipoAtendimento->nome ?? 'ASSUNTO') }}
        </div>

        <div class="solicitation-number">
            Solicitação nº: <span class="underline-text">{{ $solicitacao->id }}</span>
        </div>

        <div class="document-body">
            <p>
                Eu, <span class="underline-text">{{ $solicitacao->nome }}</span>, portador do CPF nº
                <span
                    class="underline-text">{{ substr($solicitacao->cpf, 0, 3) }}.{{ substr($solicitacao->cpf, 3, 3) }}.{{ substr($solicitacao->cpf, 6, 3) }}-{{ substr($solicitacao->cpf, 9, 2) }}</span>,
                @if ($solicitacao->matricula)
                    matrícula <span class="underline-text">{{ $solicitacao->matricula }}</span>
                @endif
                na qualidade de Servidor Inativo (aposentado e/ou pensionista),
                venho requerer a antecipação do recebimento da 1ª parcela do Abono Anual (13º salário), na forma da lei.
            </p>
            <p>
                Declaro ainda ciência de que essa solicitação passará pela análise de setor competente, não implicando
                em lançamento em folha de forma automática, ficando a meu critério entrar em contato com o PREVMOC a
                partir da segunda quinzena do mês vigente para verificação do status da minha solicitação.
            </p>
            <p>
                Estou ciente de que os dados coletados serão tratados com segurança, respeitando os princípios da
                finalidade, adequação e necessidade, e não serão compartilhados com terceiros estranhos ao processo,
                exceto por obrigação legal ou regulatória.
            </p>
        </div>

        <div class="location-date">
            Montes Claros, <span class="underline-text">{{ $solicitacao->created_at->format('d') }}</span> de
            <span class="underline-text">{{ $solicitacao->created_at->locale('pt_BR')->translatedFormat('F') }}</span>
            de
            <span class="underline-text">{{ $solicitacao->created_at->format('Y') }}</span>.
        </div>

        @if ($solicitacao->assinatura)
            <div class="signature-line">
                <div style="text-align: center; margin-bottom: 10px;">
                    <img src="{{ $solicitacao->assinatura }}" alt="Assinatura" style="max-height: 60px;">
                </div>
                <div class="signature-line-border">
                    {{ $solicitacao->nome }}
                </div>
            </div>
        @else
            <div class="signature-line">
                <div class="signature-line-border">
                    {{ $solicitacao->nome }}
                </div>
            </div>
        @endif

        @if ($solicitacao->foto)
            <div class="photo-container">
                <img src="{{ $solicitacao->foto_otimizada ?? public_path('storage/' . $solicitacao->foto) }}"
                    alt="Foto do solicitante">
            </div>
        @else
            <div class="photo-container">
                <div class="photo-placeholder">[FOTO]</div>
            </div>
        @endif
        <footer>
            <div style="text-align: center; font-size: 10px; color: #666; margin-top: 20px;">
                Av. José Corrêa Machado, 1380 - Jardim Sao Luiz, Montes Claros - MG, 39401-856<br>
                Telefone: (38) 2211-3880 | (38) 2211-3896
            </div>
        </footer>

    </div>
</body>

</html>
