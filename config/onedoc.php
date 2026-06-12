<?php

return [
    'base_url' => env('ONEDOC_BASE_URL', 'https://integracoes.1doc.link'),
    'api_key' => env('ONEDOC_API_KEY'),

    'public_base_url' => env('ONEDOC_PUBLIC_BASE_URL', env('APP_URL')),

    'enviar_anexo' => filter_var(env('ONEDOC_ENVIAR_ANEXO', true), FILTER_VALIDATE_BOOLEAN),

    'anexo_url_expira_horas' => (int) env('ONEDOC_ANEXO_URL_EXPIRA_HORAS', 24),
    'anexo_download_grace_minutes' => (int) env('ONEDOC_ANEXO_DOWNLOAD_GRACE_MINUTES', 30),

    'campos_padrao' => [
        [
            'campo' => 'entrada',
            'valor' => 'Site',
        ],
    ],
];
