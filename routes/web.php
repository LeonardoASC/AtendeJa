<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TipoAtendimentoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SenhaController;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\GuicheController;
use App\Http\Controllers\RelatorioController;

Route::get('/', [SiteController::class, 'index'])->name('site.index');
// Route::get('/senhas/{codigo}/ticket-virtual', [SenhaController::class, 'ticketVirtual'])->name('senhas.ticket-virtual');
      
Route::get('/busca-cpf/consultar', [SiteController::class, 'consultarCpf'])->name('busca.cpf.search');

Route::get('/senhas/{token}/ticket-virtual', [SenhaController::class, 'ticketVirtual'])->name('senhas.ticket-virtual')->whereUlid('token'); 
Route::middleware(['auth:admin', 'verified'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('permission:ver-dashboard');

        Route::get('/telao', [SenhaController::class, 'telao'])->name('senhas.telao')->middleware('permission:ver-telao');
        Route::get('/senhas/perguntas-frequentes', [SenhaController::class, 'perguntasFrequentes'])->name('senhas.perguntas-frequentes');

        Route::resource('tipo-atendimentos', TipoAtendimentoController::class)->middleware('permission:ver-tipoAtendimento');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::resource('users', UserController::class)->middleware('permission:ver-usuarios');
        Route::resource('admins', AdminController::class)->middleware('permission:ver-admin');
        Route::resource('roles', RoleController::class)->middleware('permission:ver-cargos');

        Route::resource('senhas', SenhaController::class)->middleware('permission:ver-senhas');
        Route::post('/senhas/chamar',[SenhaController::class, 'chamar'])->name('senhas.chamar')->middleware('permission:ver-senhas');
        Route::post('/senhas/{senha}/finalizar', [SenhaController::class, 'finalizar'])->name('senhas.finalizar');
        Route::post('/senhas/{senha}/cancelar', [SenhaController::class, 'cancelar'])->name('senhas.cancelar');
        Route::post('/senhas/{senha}/chamar', [SenhaController::class, 'chamarSenha'])->name('senhas.chamarSenha'); 

        Route::get('/select-guiche', [GuicheController::class, 'selectGuiche'])->name('guiche.select')->middleware('permission:ver-guiche');
        Route::get('/select-guiche/{guiche:slug}', [GuicheController::class, 'guichePanel'])->name('guiche.panel')->middleware('permission:ver-guiche');
        
        Route::resource('guiches', GuicheController::class)->parameters(['guiches' => 'guiche'])->middleware('permission:ver-guiche');
        
        Route::get('/relatorios', [RelatorioController::class, 'index'])->name('relatorio.index')->middleware('permission:ver-relatorios');
        Route::get('/relatorios/senhas/pdf', [RelatorioController::class, 'senhasPdf'])->name('relatorios.senhas.pdf')->middleware('permission:ver-relatorios');
    });

require __DIR__.'/auth.php';
