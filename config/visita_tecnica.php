<?php

return [

    /*
    | Limites da API pública de solicitação de visita técnica (prova de vida
    | em atendimento domiciliar). Todos os limites são por IP.
    */

    // Requisições ao endpoint, válidas ou não, por minuto.
    'tentativas_por_minuto' => (int) env('VISITA_TECNICA_TENTATIVAS_POR_MINUTO', 10),

    // Intervalo mínimo, em segundos, entre dois cadastros com sucesso.
    'intervalo_entre_cadastros' => (int) env('VISITA_TECNICA_INTERVALO_ENTRE_CADASTROS', 120),

    // Cadastros com sucesso permitidos por dia.
    'cadastros_por_dia' => (int) env('VISITA_TECNICA_CADASTROS_POR_DIA', 5),

];
