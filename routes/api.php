<?php

use App\Http\Controllers\VisitaTecnicaController;
use App\Http\Middleware\LimitarCadastroVisitaTecnica;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/visitas-tecnicas', [VisitaTecnicaController::class, 'store'])
        ->middleware(['throttle:visitas-tecnicas', LimitarCadastroVisitaTecnica::class])
        ->name('api.visitas-tecnicas.store');
});
