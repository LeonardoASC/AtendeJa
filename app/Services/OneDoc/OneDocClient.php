<?php

namespace App\Services\OneDoc;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OneDocClient
{
    private PendingRequest $httpJson;
    private PendingRequest $httpMultipart;

    public function __construct()
    {
        $baseUrl = rtrim(config('onedoc.base_url'), '/');

        $headers = [
            'x-auth-hash' => config('onedoc.api_key'),
            'Accept' => 'application/json',
        ];

        $this->httpJson = Http::baseUrl($baseUrl)
            ->withHeaders($headers)
            ->asJson()
            ->timeout(30);

        $this->httpMultipart = Http::baseUrl($baseUrl)
            ->withHeaders($headers)
            ->asMultipart()
            ->timeout(60);
    }

    public function get(string $path, array $query = []): array
    {
        Log::info('OneDoc API Request [GET]', [
            'path' => $path,
            'query' => $query,
        ]);

        $response = $this->httpJson->get($path, $query);

        Log::info('OneDoc API Response [GET]', [
            'path' => $path,
            'status' => $response->status(),
            'body' => $response->body(),
            'json' => $response->json(),
        ]);

        return $response->throw()->json();
    }

    public function postJson(string $path, array $payload = []): array
    {
        Log::info('OneDoc API Request [POST JSON]', [
            'path' => $path,
            'payload' => $payload,
        ]);

        $response = $this->httpJson->post($path, $payload);

        Log::info('OneDoc API Response [POST JSON]', [
            'path' => $path,
            'status' => $response->status(),
            'body' => $response->body(),
            'json' => $response->json(),
        ]);

        return $response->throw()->json();
    }

    public function postMultipart(string $path, array $fields = []): array
    {
        Log::info('OneDoc API Request [POST MULTIPART]', [
            'path' => $path,
            'fields' => $fields,
        ]);

        $response = $this->httpMultipart->post($path, $fields);

        Log::info('OneDoc API Response [POST MULTIPART]', [
            'path' => $path,
            'status' => $response->status(),
            'body' => $response->body(),
            'json' => $response->json(),
            'headers' => $response->headers(),
        ]);

        return $response->throw()->json();
    }
}
