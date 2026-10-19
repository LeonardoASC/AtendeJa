<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use App\Rules\CpfValido;

class StoreSenhaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * E-mail não é obrigatório para gerar senha: se vier inválido
     * (ex.: cadastro externo com e-mail malformado), descarta em vez de bloquear.
     */
    protected function prepareForValidation(): void
    {
        $email = trim((string) $this->input('email', ''));

        if ($email !== '' && Validator::make(['email' => $email], ['email' => 'email|max:255'])->fails()) {
            $email = '';
        }

        $this->merge(['email' => $email !== '' ? $email : null]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cpf' => ['required', 'string', 'size:11', new CpfValido],
            'email' => 'nullable|email|max:255',
            'nome' => 'nullable|string|max:255',
            'matricula' => 'nullable|string|max:255',
            'tipo_atendimento_id' => ['required', 'exists:tipo_atendimentos,id'],
        ];
    }
}
