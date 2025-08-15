<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BuscaCpfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $cpf = preg_replace('/\D/', '', (string) $this->query('CPF'));
        $this->merge(['CPF' => $cpf]);
    }

    public function rules(): array
    {
        return [
            'CPF' => ['required', 'digits:11'],
        ];
    }

    public function messages(): array
    {
        return [
            'CPF.required' => 'Informe o CPF.',
            'CPF.digits'   => 'CPF deve conter 11 dígitos.',
        ];
    }
}
