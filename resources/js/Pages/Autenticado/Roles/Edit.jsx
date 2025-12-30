// View: resources/js/Pages/Roles/Edit.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ role, permissions, rolePermissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name ?? '',
        permissions: rolePermissions ?? [],
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    const groupByPrefix = (perms = []) => {
        const groups = { ver: [], criar: [], editar: [], excluir: [] };
        perms.forEach((p) => {
            if (!p?.name) return;
            if (p.name.startsWith('ver-')) groups.ver.push(p);
            else if (p.name.startsWith('criar-')) groups.criar.push(p);
            else if (p.name.startsWith('editar-')) groups.editar.push(p);
            else if (p.name.startsWith('excluir-')) groups.excluir.push(p);
        });
        return groups;
    };

    const { ver, criar, editar, excluir } = groupByPrefix(permissions);
    const togglePermission = (id) =>
        setData(
            'permissions',
            data.permissions.includes(id)
                ? data.permissions.filter((p) => p !== id)
                : [...data.permissions, id]
        );

    const Column = ({ title, list, color }) =>
        list.length > 0 && (
            <div>
                <h4 className="mb-2 font-semibold text-gray-700">{title}</h4>
                <div className="flex flex-col gap-2">
                    {list.map((perm) => {
                        const checked = data.permissions.includes(perm.id);
                        return (
                            <button
                                key={perm.id}
                                type="button"
                                onClick={() => togglePermission(perm.id)}
                                className={`text-left px-3 py-2 rounded border transition-colors ${checked
                                        ? `${color} text-white border-transparent`
                                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                {perm.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        );

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Editar Cargo</h2>}
        >
            <Head title="Editar Cargo" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Nome do Cargo
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Permissões
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <Column title="Ver" list={ver} color="bg-blue-600 hover:bg-blue-700" />
                                    <Column title="Criar" list={criar} color="bg-green-600 hover:bg-green-700" />
                                    <Column title="Editar" list={editar} color="bg-yellow-500 hover:bg-yellow-600" />
                                    <Column title="Excluir" list={excluir} color="bg-red-600 hover:bg-red-700" />
                                </div>

                                {errors.permissions && (
                                    <div className="text-red-600 text-sm mt-1">{errors.permissions}</div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    {processing ? 'Atualizando...' : 'Atualizar'}
                                </button>
                                <Link
                                    href={route('roles.index')}
                                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition"
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
