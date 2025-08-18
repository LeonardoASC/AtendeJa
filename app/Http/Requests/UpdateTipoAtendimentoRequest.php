<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoAtendimentoRequest extends FormRequest
{
    /**
     * Autoriza a requisição.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação.
     */
    public function rules(): array
    {
        return [
            'nome'   => ['required', 'string', 'max:255'],
            'guiche' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Mensagens personalizadas.
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'nome.string'   => 'O nome deve ser um texto.',
            'nome.max'      => 'O nome não pode ultrapassar :max caracteres.',
            'guiche.string' => 'O guichê deve ser um texto.',
            'guiche.max'    => 'O guichê não pode ultrapassar :max caracteres.',
        ];
    }

    /**
     * Nomes dos atributos (para mensagens).
     */
    public function attributes(): array
    {
        return [
            'nome'   => 'nome',
            'guiche' => 'guichê',
        ];
    }

    /**
     * Normalizações antes da validação.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'nome'   => is_string($this->nome) ? trim($this->nome) : $this->nome,
            'guiche' => is_string($this->guiche) ? trim($this->guiche) : $this->guiche,
        ]);
    }
}
