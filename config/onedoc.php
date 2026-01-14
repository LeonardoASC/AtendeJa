<?php

return [
    'base_url' => env('ONEDOC_BASE_URL', 'https://integracoes.1doc.link'),
    'api_key' => env('ONEDOC_API_KEY'),

    'public_base_url' => env('ONEDOC_PUBLIC_BASE_URL', env('APP_URL')),

    'enviar_anexo' => filter_var(env('ONEDOC_ENVIAR_ANEXO', true), FILTER_VALIDATE_BOOLEAN),

    'protocolos' => [
        'adiantamento_13' => [
            'enabled' => true,
            'tipo_atendimento_id' => (int) env('ONEDOC_13_TIPO_ATENDIMENTO_ID', 0),
            'destino_id_setor' => (int) env('ONEDOC_13_DESTINO_ID_SETOR', 0),
            'id_assunto' => (int) env('ONEDOC_13_ID_ASSUNTO', 0),
            'campos' => [
                [
                    'campo' => 'entrada',
                    'valor' => 'Totem de atendimento',
                ],
            ],
        ],
    ],
];
