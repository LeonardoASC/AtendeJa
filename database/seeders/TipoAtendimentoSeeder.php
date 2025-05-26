<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoAtendimento;

class TipoAtendimentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            'Prova de Vida',
            'Processo Administrativo',
            'Adiantamento 13º',
            'Informações sobre Aposentadoria',
            'Informações sobre Contribuição',
            'Outros',
        ];

        foreach ($tipos as $tipo) {
            TipoAtendimento::create(['nome' => $tipo]);
        }

    }
}
