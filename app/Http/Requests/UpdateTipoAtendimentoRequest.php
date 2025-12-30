<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

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
            'nome' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tipo_atendimentos', 'nome')->ignore($this->route('tipo_atendimento')->id),
            ],
            'tem_formulario' => ['nullable', 'boolean'],
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
        ];
    }

    /**
     * Nomes dos atributos (para mensagens).
     */
    public function attributes(): array
    {
        return [
            'nome'   => 'nome',
        ];
    }

    /**
     * Normalizações antes da validação.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'nome'   => is_string($this->nome) ? trim($this->nome) : $this->nome,
        ]);
    }
}
