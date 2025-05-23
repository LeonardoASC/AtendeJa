<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission; 

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $allPermissions = Permission::all();

        return Inertia::render('Autenticado/Roles/Index', [
            'roles' => $roles,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::all();

        return Inertia::render('Autenticado/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $data = $request->validated();
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'],
        ]);
        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }
        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::where('guard_name', 'admin')->get();

        $rolePermissions = $role->permissions->pluck('id');

        return Inertia::render('Autenticado/Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $data = $request->validated();
        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions']);
        return redirect()->route('roles.index')->with('success', 'Cargo atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if ($role->name === 'Administrador') {
            return redirect()->route('roles.index')->with('error', 'A role "Administrador" não pode ser excluída.');
        }
    
        if ($role->users()->exists()) {
            return redirect()->route('roles.index')->with('error', 'Não é possível excluir esse cargo pois há usuários associados.');
        }
    
        $role->permissions()->detach();
        $role->delete();
    
        return redirect()->route('roles.index')->with('success', 'Cargo excluído com sucesso!');
    }
}
