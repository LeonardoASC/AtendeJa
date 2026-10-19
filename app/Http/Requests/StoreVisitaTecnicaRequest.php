<?php

namespace App\Http\Requests;

use App\Models\VisitaTecnica;
use App\Rules\CpfValido;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreVisitaTecnicaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'min:3', 'max:255'],
            'cpf' => ['required', 'string', 'size:11', new CpfValido],
            'telefone' => ['required', 'string', 'regex:/^\d{10,11}$/'],
            'email' => ['required', 'email', 'max:255'],

            'cep' => ['nullable', 'string', 'regex:/^\d{8}$/'],
            'logradouro' => ['required', 'string', 'max:255'],
            'numero' => ['required', 'string', 'max:20'],
            'complemento' => ['nullable', 'string', 'max:100'],
            'bairro' => ['required', 'string', 'max:100'],
            'cidade' => ['required', 'string', 'max:100'],
            'ponto_referencia' => ['nullable', 'string', 'max:255'],

            'justificativa' => ['required', 'string', 'min:10', 'max:2000'],

            'solicitante_tipo' => ['required', Rule::in(VisitaTecnica::SOLICITANTES)],
            'solicitante_nome' => ['exclude_if:solicitante_tipo,proprio', 'required', 'string', 'min:3', 'max:255'],
            'solicitante_telefone' => ['exclude_if:solicitante_tipo,proprio', 'nullable', 'string', 'regex:/^\d{10,11}$/'],

            // Honeypot: campo oculto no formulário, deve chegar vazio.
            'website' => ['prohibited'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->has('cpf')) {
                    return;
                }

                $jaExiste = VisitaTecnica::query()
                    ->where('cpf', $this->input('cpf'))
                    ->where('exercicio', now()->year)
                    ->whereIn('status', VisitaTecnica::STATUS_EM_ABERTO)
                    ->exists();

                if ($jaExiste) {
                    $validator->errors()->add('cpf', 'Já existe uma solicitação em andamento para este CPF neste exercício.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'telefone.regex' => 'Informe o telefone com DDD, apenas números.',
            'solicitante_telefone.regex' => 'Informe o telefone com DDD, apenas números.',
            'cep.regex' => 'O CEP deve conter 8 dígitos.',
            'website.prohibited' => 'Requisição inválida.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $digitos = fn ($valor) => is_string($valor) ? preg_replace('/\D/', '', $valor) : $valor;
        $texto = fn ($valor) => is_string($valor) ? trim($valor) : $valor;

        $this->merge([
            'cpf' => $digitos($this->cpf),
            'telefone' => $digitos($this->telefone),
            'cep' => $digitos($this->cep) ?: null,
            'solicitante_telefone' => $digitos($this->solicitante_telefone) ?: null,
            'nome' => $texto($this->nome),
            'email' => $texto($this->email),
            'solicitante_nome' => $texto($this->solicitante_nome),
            'justificativa' => $texto($this->justificativa),
            'solicitante_tipo' => $this->solicitante_tipo ?: 'proprio',
        ]);
    }
}
