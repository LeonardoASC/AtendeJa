<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = Admin::with('roles')->get();
    
        $admins->transform(function ($admin) {
            $admin->all_permissions = $admin->getAllPermissions();
            return $admin;
        });
    
        return Inertia::render('Autenticado/Admins/Index', [
            'admins' => $admins,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::where('guard_name', 'admin')->get();
        // $permissions = Permission::where('guard_name', 'admin')->get();

        return Inertia::render('Autenticado/Admins/Create', [
            'roles' => $roles,
            // 'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        $data = $request->validated();
        $admin = Admin::create($data);
        
        if (!empty($data['role'])) {
            $admin->assignRole($data['role']); 
        }
        return redirect()->route('admins.index')->with('success', 'Admin criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        $roles = Role::where('guard_name', 'admin')->get();

        return Inertia::render('Autenticado/Admins/Edit', [
            'admin' => $admin,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        $data = $request->validated();
        if (!empty($data['password'])) {
            $admin->password = Hash::make($data['password']);
        }
        $admin->name = $data['name'];
        $admin->email = $data['email'];
        $admin->save();

        if (!empty($data['role'])) {
            $admin->syncRoles([$data['role']]);
        }
        return redirect()->route('admins.index')->with('success', 'Admin atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        if ($admin->email === 'suporte2.prevmoc@gmail.com') {
            return redirect()->back()->with('error', 'Não é permitido excluir o usuario master do sistema!');
        }

        $admin->delete();
        return redirect()->route('admins.index')->with('success', 'Admin excluído com sucesso!');
    }
}
