import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ roles, allPermissions }) {

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


    const totals = groupByPrefix(allPermissions ?? []);
    const Group = ({ title, list, total, badgeColor }) => (
        total > 0 && (
            <div className="mb-3">
                <h6 className="text-sm font-semibold text-gray-700 mb-1">
                    {title}{' '}
                    <span className="text-xs text-gray-500">
                        {list.length} de {total}
                    </span>
                </h6>
                {list.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {list.map((perm) => (
                            <span
                                key={perm.id}
                                className={`inline-block ${badgeColor} text-xs px-2 py-1 rounded`}
                            >
                                {perm.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400">Nenhuma.</p>
                )}
            </div>
        )
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gerenciar Cargos (Roles)
                </h2>
            }
        >
            <Head title="Lista de Cargos" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Lista de Cargos</h3>
                            <Link
                                href={route('roles.create')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Novo Cargo
                            </Link>
                        </div>

                        {roles && roles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {roles.map((role) => {
                                    const { ver, criar, editar, excluir } = groupByPrefix(role.permissions);
                                    return (
                                        <div
                                            key={role.id}
                                            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                                        >
                                            {/* título e guard */}
                                            <div className="mb-4 border-b border-gray-100 pb-2">
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {role.name}
                                                </h4>
                                                <p className="text-sm text-gray-400">
                                                    Guard:{' '}
                                                    <span className="text-gray-600">{role.guard_name}</span>
                                                </p>
                                            </div>

                                            <Group
                                                title="Permissões de ver"
                                                list={ver}
                                                total={totals.ver.length}
                                                badgeColor="bg-blue-100 text-blue-700"
                                            />
                                            <Group
                                                title="Permissões de criar"
                                                list={criar}
                                                total={totals.criar.length}
                                                badgeColor="bg-green-100 text-green-700"
                                            />
                                            <Group
                                                title="Permissões de editar"
                                                list={editar}
                                                total={totals.editar.length}
                                                badgeColor="bg-yellow-100 text-yellow-700"
                                            />
                                            <Group
                                                title="Permissões de excluir"
                                                list={excluir}
                                                total={totals.excluir.length}
                                                badgeColor="bg-red-100 text-red-700"
                                            />

                                            {/* ações */}
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Link
                                                    href={route('roles.edit', role.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    Editar
                                                </Link>

                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (confirm('Deseja realmente excluir este cargo?')) {
                                                            router.delete(route('roles.destroy', role.id));
                                                        }
                                                    }}
                                                >
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                    >
                                                        Excluir
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">Nenhum cargo encontrado.</p>
                        )}
                    </div>

                    {allPermissions && allPermissions.length > 0 && (
                        <div className="bg-white mt-6 border border-gray-200 shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-3">Todas as Permissões Existentes</h3>
                            <div className="flex flex-wrap gap-2">
                                {allPermissions.map((perm) => (
                                    <span
                                        key={perm.id}
                                        className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                    >
                                        {perm.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
