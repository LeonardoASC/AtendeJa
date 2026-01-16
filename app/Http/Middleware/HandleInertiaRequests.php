<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user('admin') ?? $request->user('web');

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? array_merge(
                    $user->toArray(),
                    ['role' => $user->getRoleNames()->first()]
                ) : null,
                'permissions' => $user?->getAllPermissions()->pluck('name') ?? [],
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'solicitacoesPendentesCount' => \App\Models\Solicitacao::where('status', 'pendente')->whereNotNull('onedoc_error')->count(),
        ]);
    }
}
