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
                'guiche' => '1'
            ],
            [
                'nome' => 'Processo Administrativo',
                'guiche' => '1'
            ],
            [
                'nome' => 'Adiantamento 13°',
                'guiche' => '2'
            ],
            [
                'nome' => 'Informações Aposentadoria', 
                'guiche' => '2'
            ],
            [
                'nome' => 'Contribuição Previdenciária',
                'guiche' => '3'
            ],
            [
                'nome' => 'Atendimento Interno',
                'guiche' => '3'
            ]
       ];

        foreach ($tipos as $tipo) {
            TipoAtendimento::create($tipo);
        }

    }
}
