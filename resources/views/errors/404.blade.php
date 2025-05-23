<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Não Encontrada - PREVMOC</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 50px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .logo img {
            max-width: 200px;
            margin-bottom: 20px;
        }
        .message h1 {
            font-size: 36px;
            color: #d9534f;
            margin-bottom: 10px;
        }
        .message p {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .navigation .btn {
            display: inline-block;
            margin: 10px;
            padding: 12px 20px;
            font-size: 18px;
            font-weight: bold;
            background-color: #007BFF;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s ease-in-out;
        }
        .navigation .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            <img 
            src="/images/logoestacionamento.png" 
            alt="Logo do Sistema de Estacionamento" 
            className="w-64 h-auto mb-6"
        />
        </div>

        <!-- Mensagem de Erro -->
        <div class="message">
            <h1>Oops! Página Não Encontrada (404)</h1>
            <p>Desculpe, mas a página que você está procurando não existe.</p>
            <p><strong>PREVMOC:</strong> Previdência Social de Montes Claros - Garantindo a segurança e o bem-estar dos servidores públicos.</p>
        </div>

        <!-- Botões de Navegação -->
        <div class="navigation">
            <a href="{{ url('/') }}" class="btn">Página Inicial</a>
            <a href="javascript:history.back()" class="btn">Página Anterior</a>
        </div>
    </div>
</body>
</html>
