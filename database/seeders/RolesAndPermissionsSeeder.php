<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate([
            'name' => 'Administrador',
            'guard_name' => 'admin',
        ]);

        $operadorRole = Role::firstOrCreate([
            'name' => 'Operador',
            'guard_name' => 'admin',
        ]);

        $caixaRole = Role::firstOrCreate([
            'name' => 'Caixa',
            'guard_name' => 'admin',
        ]);

    
        $permissions = [
            'ver-dashboard',
            'criar-dashboard',
            'editar-dashboard',
            'excluir-dashboard',
            'ver-patio',
            'criar-patio',
            'editar-patio',
            'excluir-patio',
            'ver-historico',
            'criar-historico',
            'editar-historico',
            'excluir-historico',
            'ver-taxas',
            'criar-taxas',
            'editar-taxas',
            'excluir-taxas',
            'ver-admin',
            'criar-admin',
            'editar-admin',
            'excluir-admin',
            'ver-usuarios',
            'criar-usuarios',
            'editar-usuarios',
            'excluir-usuarios',
            'ver-cargos',
            'criar-cargos',
            'editar-cargos',
            'excluir-cargos',
            'ver-relatorios',
            'criar-relatorios',
            'editar-relatorios',
            'excluir-relatorios',
        ];
        

        foreach ($permissions as $permission) {
            $perm = Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'admin',
            ]);
        }

        $adminRole->givePermissionTo(Permission::all());

        $operadorRole->givePermissionTo([
            'ver-dashboard',
            'ver-patio',
            'ver-historico',
            'ver-usuarios',
            'criar-patio',
        ]);
        $caixaRole->givePermissionTo([
            'ver-dashboard',
            'ver-patio',
            'ver-historico',
            'editar-patio',
            'ver-usuarios',
        ]);
    }
}
