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
            [
                'nome' => 'Prova de Vida',
            ],
            [
                'nome' => 'Processo Administrativo',
            ],
            [
                'nome' => 'Adiantamento 13°',
            ],
            [
                'nome' => 'Informações Aposentadoria', 
            ],
            [
                'nome' => 'Contribuição Previdenciária',
            ],
            [
                'nome' => 'Atendimento Interno',
            ]
       ];

        foreach ($tipos as $tipo) {
            TipoAtendimento::create($tipo);
        }

    }
}
