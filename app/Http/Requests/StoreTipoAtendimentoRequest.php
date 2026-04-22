<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTipoAtendimentoRequest extends FormRequest
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
            'nome'   => ['required', 'string', 'max:255', 'unique:tipo_atendimentos,nome'],
            'tem_formulario' => ['nullable', 'boolean'],
            'onedoc_enabled' => ['nullable', 'boolean'],
            'onedoc_destino_id_setor' => ['nullable', 'integer', 'min:1', 'required_if:onedoc_enabled,1'],
            'onedoc_id_assunto' => ['nullable', 'integer', 'min:1', 'required_if:onedoc_enabled,1'],
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
            'nome.unique'   => 'Já existe um tipo de atendimento com este nome.',
            'onedoc_destino_id_setor.required_if' => 'Informe o Destino ID Setor quando o OneDoc estiver habilitado.',
            'onedoc_destino_id_setor.integer' => 'Destino ID Setor deve ser um número inteiro.',
            'onedoc_destino_id_setor.min' => 'Destino ID Setor deve ser maior que zero.',
            'onedoc_id_assunto.required_if' => 'Informe o ID Assunto quando o OneDoc estiver habilitado.',
            'onedoc_id_assunto.integer' => 'ID Assunto deve ser um número inteiro.',
            'onedoc_id_assunto.min' => 'ID Assunto deve ser maior que zero.',
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
            'onedoc_enabled' => filter_var($this->onedoc_enabled, FILTER_VALIDATE_BOOLEAN),
        ]);

        if (!$this->boolean('onedoc_enabled')) {
            $this->merge([
                'onedoc_destino_id_setor' => null,
                'onedoc_id_assunto' => null,
            ]);
        }
    }
}
