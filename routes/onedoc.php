<?php

use App\Http\Controllers\SolicitacaoController;
use Illuminate\Support\Facades\Route;

Route::match(['GET', 'HEAD'], '/onedoc/anexos/{solicitacao}/{expires}/{token}/{filename}', [SolicitacaoController::class, 'visualizarAnexoOneDoc'])
    ->whereNumber('expires')
    ->name('onedoc.anexos.show');
