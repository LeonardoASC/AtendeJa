<?php

namespace Database\Factories;

use App\Models\VisitaTecnica;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VisitaTecnica>
 */
class VisitaTecnicaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $exercicio = now()->year;

        return [
            'protocolo' => VisitaTecnica::generateUniqueProtocolo($exercicio),
            'exercicio' => $exercicio,
            'status' => VisitaTecnica::STATUS_PENDENTE,
            'canal' => 'eletronico',
            'nome' => fake()->name(),
            'cpf' => '52998224725',
            'email' => fake()->safeEmail(),
            'telefone' => '38999998888',
            'logradouro' => fake()->streetName(),
            'numero' => (string) fake()->buildingNumber(),
            'bairro' => 'Centro',
            'cidade' => 'Montes Claros',
            'justificativa' => 'Beneficiário acamado após cirurgia recente.',
            'solicitante_tipo' => 'proprio',
        ];
    }
}
