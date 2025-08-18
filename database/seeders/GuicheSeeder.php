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
            ['nome' => '1'],
            ['nome' => '2'],
            ['nome' => '3'],
        ];

        foreach ($guiches as $g) {
            Guiche::firstOrCreate($g);
        }
    }
}
