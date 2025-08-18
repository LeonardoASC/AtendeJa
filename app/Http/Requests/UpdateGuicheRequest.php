<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UpdateGuicheRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $guich = $this->route('guich') ?? $this->route('guiche');

        return [
            'nome' => [
                'required',
                'string',
                'max:50',
                Rule::unique('guiches', 'nome')->ignore($guich),
            ],
            'tipo_atendimento_ids' => ['nullable', 'array'],
            'tipo_atendimento_ids.*' => ['integer', 'exists:tipo_atendimentos,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $nome = is_string($this->nome) ? trim($this->nome) : $this->nome;
        $slug = $this->slug ?: Str::slug((string) $nome);

        $this->merge(compact('nome', 'slug'));
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome do guichê é obrigatório.',
            'nome.unique'   => 'Este nome de guichê já está cadastrado.',
            'nome.max'      => 'O nome do guichê não pode ter mais de 50 caracteres.',
            'nome.string'  => 'O nome do guichê deve ser uma string.'
        ];
    }
}
