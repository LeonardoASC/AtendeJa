<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);

        RateLimiter::for('visitas-tecnicas', function (Request $request) {
            return Limit::perMinute(config('visita_tecnica.tentativas_por_minuto'))
                ->by($request->ip())
                ->response(fn (Request $request, array $headers) => response()->json([
                    'message' => 'Muitas tentativas. Aguarde um momento e tente novamente.',
                ], 429, $headers));
        });
    }
}
