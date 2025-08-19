<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Http\Requests\StoreSiteRequest;
use App\Http\Requests\UpdateSiteRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Http\Requests\BuscaCpfRequest;



class SiteController extends Controller
{

    public function index()
    {
        return Inertia::render('Home/Index');
    }


    public function consultarCpf(BuscaCpfRequest $request)
    {
        $cpf = preg_replace('/\D/', '', $request->validated('CPF'));
        $url = rtrim(env('JG_BASE_URL'), '/') . '/file/CAD_PESSOAS_Prevmoc.xml';

        try {
            $res = $this->chamadaApi()->get($url, ['CPF' => $cpf]);

            if (!$res->successful()) {
                return response()->json([
                    'data'  => [],
                    'error' => ['status' => $res->status()],
                ], 200);
            }

            $data = collect($res->json())
                ->reject(fn ($i) => isset($i['ID_CLIENTE']) || isset($i['DATA_CADASTRO'])) // remove header
                ->map(function ($i) {
                    $email = $i['EMAIL'] ?? null;
                    if (is_array($email)) $email = $email[0] ?? null;

                    return [
                        'NOME'      => $i['NOME'] ?? null,
                        'MATRICULA' => $i['MATRICULA'] ?? null,
                        'CPF'       => isset($i['CPF']) ? preg_replace('/\D/', '', $i['CPF']) : null,
                        'EMAIL'     => $email,
                    ];
                })
                ->filter(fn ($i) => $i['NOME'] || $i['MATRICULA'] || $i['CPF'] || $i['EMAIL'])
                ->values();

            return response()->json(['data' => $data], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'data'  => [],
                'error' => ['message' => $e->getMessage()],
            ], 200);
        }
    }

    private function chamadaApi()
    {
        $returnApi = Http::withHeaders([
                'Authorization' => 'Bearer '.env('JG_TOKEN'),
                'Accept'        => 'application/json',
                'User-Agent'    => 'curl/7.88.1',
            ])
            ->timeout(20);

        // if (app()->environment('local')) {
        //     $returnApi = $returnApi->withoutVerifying();
        // }

        return $returnApi;
    }
}