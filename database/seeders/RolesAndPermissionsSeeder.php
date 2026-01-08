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

        $permissions = [
            'ver-dashboard',
            'criar-dashboard',
            'editar-dashboard',
            'excluir-dashboard',
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
            'ver-senhas',
            'criar-senhas',
            'editar-senhas',
            'excluir-senhas',
            'ver-telao',
            'criar-telao',
            'editar-telao',
            'excluir-telao',
            'ver-guiche',
            'criar-guiche',
            'editar-guiche',
            'excluir-guiche',
            'ver-tipoAtendimento',
            'criar-tipoAtendimento',
            'editar-tipoAtendimento',
            'excluir-tipoAtendimento',
            'ver-gerenciarGuiche',
            'criar-gerenciarGuiche',
            'editar-gerenciarGuiche',
            'excluir-gerenciarGuiche',
            'ver-voucher',
            'criar-voucher',
            'editar-voucher',
            'excluir-voucher',
            'ver-solicitacoes',
            'criar-solicitacoes',
            'editar-solicitacoes',
            'excluir-solicitacoes',
        ];
        

        foreach ($permissions as $permission) {
            $perm = Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'admin',
            ]);
        }

        $adminRole->givePermissionTo(Permission::all());

    }
}
