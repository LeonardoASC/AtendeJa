<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SenhaController;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\GuicheController;

Route::get('/', [SiteController::class, 'index'])->name('site.index');

Route::get('/telao', [SenhaController::class, 'telao'])->name('senhas.telao');

Route::middleware(['auth:admin', 'verified'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::resource('users', UserController::class);
        Route::resource('admins', AdminController::class);
        Route::resource('roles', RoleController::class);

        Route::resource('senhas', SenhaController::class);
        Route::post('/senhas/chamar',[SenhaController::class, 'chamar'])->name('senhas.chamar');
        Route::post('/senhas/{senha}/finalizar', [SenhaController::class, 'finalizar'])->name('senhas.finalizar');
        
        Route::get('/guiche', [GuicheController::class, 'index'])->name('guiche.index');
        Route::get('/guiche/{guiche}', [GuicheController::class, 'guichePanel'])->name('guiche.panel');
    });

require __DIR__.'/auth.php';
