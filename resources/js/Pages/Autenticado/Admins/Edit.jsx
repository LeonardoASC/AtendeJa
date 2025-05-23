import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ admin, roles }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: admin.name || '',
        email: admin.email || '',
        password: '',
        role: '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('admins.update', admin.id));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Admin</h2>}
        >
            <Head title={`Editar Admin - ${admin.name}`} />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Atualize os dados do Admin
                        </h3>
                        <div className="p-4 bg-gray-100 border-l-4 border-blue-500 rounded mb-2">
                            <p className="text-sm text-gray-700">
                                Você pode atualizar os dados do administrador, incluindo o nome, e-mail e senha. Se não quiser alterar a senha, deixe os campos de senha em branco.
                            </p>
                        </div>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Nome</label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para identificação do nome do administrador</p>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="Ex: João Admin"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">E-mail</label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para identificação do e-mail do administrador</p>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="Ex: admin@dominio.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Nova Senha (opcional)
                                </label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para alterar a senha do administrador</p>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="Deixe em branco para não alterar"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                />
                                {errors.password && (
                                    <div className="text-red-600 text-sm mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Confirmar Senha (opcional)
                                </label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para confirmar a alteração da senha do administrador</p>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="Deixe em branco para não alterar"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                {errors.password_confirmation && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>

                            {roles && roles.length > 0 && (
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700">
                                        Role
                                    </label>
                                    <p className="text-gray-500 text-xs mb-1">Campo utilizado para atribuir uma nova role ao administrador</p>
                                    <select
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="">Não alterar ou remover roles</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    {processing ? 'Enviando...' : 'Atualizar'}
                                </button>
                                <Link
                                    href={route('admins.index')}
                                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
