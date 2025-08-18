<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guiche>
 */
class GuicheFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Guiche::class;

    public function definition(): array
    {
        static $num = 1;
        return [
            'nome' => (string) $num++,
        ];
    }
}
