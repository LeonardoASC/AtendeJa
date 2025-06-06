<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Guiche;

class GuicheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guiches = [
            ['numero' => '1'],
            ['numero' => '2'],
            ['numero' => '3'],
        ];

        foreach ($guiches as $g) {
            Guiche::firstOrCreate($g);
        }
    }
}
