<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Admin::updateOrCreate(
            ['email' => 'admin@adm.com'],
            [
                'name' => 'Administrador', 
                'password' => Hash::make('123123123'),
            ]
        );

        $role = Role::firstOrCreate([
            'name' => 'Administrador',
            'guard_name' => 'admin',
        ]);
        $admin->assignRole($role);
    }
}
