<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuicheRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero' => ['required', 'string', 'max:50', Rule::unique('guiches', 'numero')],
            'tipo_atendimento_ids' => ['nullable', 'array'],
            'tipo_atendimento_ids.*' => ['integer', 'exists:tipo_atendimentos,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'numero' => is_string($this->numero) ? trim($this->numero) : $this->numero,
        ]);
    }

    public function messages(): array
    {
        return [
            'numero.required' => 'O número do guichê é obrigatório.',
            'numero.unique'   => 'Este número de guichê já está cadastrado.',
        ];
    }
}
