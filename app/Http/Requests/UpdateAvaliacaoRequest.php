<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateAvaliacaoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nome' => [
                'required',
                'string',
                'max:255',
                Rule::unique('servicos_avaliacao', 'nome')->ignore($this->route('servicoAvaliacao')?->id),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('servicos_avaliacao', 'slug')->ignore($this->route('servicoAvaliacao')?->id),
            ],
            'descricao' => ['nullable', 'string', 'max:500'],
            'ativo' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.unique' => 'Ja existe esse tipo de avaliacao.',
            'slug.unique' => 'Ja existe esse tipo de avaliacao.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $nomeNormalizado = is_string($this->nome) ? trim($this->nome) : $this->nome;
        $slugNormalizado = Str::slug((string) $nomeNormalizado);

        $this->merge([
            'nome' => $nomeNormalizado,
            'slug' => $slugNormalizado !== '' ? $slugNormalizado : 'servico-avaliacao',
            'descricao' => is_string($this->descricao) ? trim($this->descricao) : $this->descricao,
            'ativo' => filter_var($this->input('ativo', true), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? true,
        ]);
    }
}
