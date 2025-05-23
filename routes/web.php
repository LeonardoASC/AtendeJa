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
use App\Http\Controllers\CounterController;
use App\Events\CounterUpdated;
use Illuminate\Support\Facades\Cache;

Route::get('/', [SiteController::class, 'index'])->name('site.index');

Route::controller(CounterController::class)->group(function () {
    Route::get('/counter', 'index')->name('counter.index');
    Route::post('/counter/increment', 'increment')->name('counter.increment');
    Route::post('/counter/decrement', 'decrement')->name('counter.decrement');
});

Route::middleware(['auth:admin', 'verified'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::resource('users', UserController::class);
        Route::resource('admins', AdminController::class);
        Route::resource('roles', RoleController::class);

    });

require __DIR__.'/auth.php';
