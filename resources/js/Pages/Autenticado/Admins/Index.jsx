import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Admins({ admins }) {
    const [modalPermissoesAberto, setModalPermissoesAberto] = useState(false);
    const [adminSelecionado, setAdminSelecionado] = useState(null);
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Administradores</h2>}
        >
            <Head title="Lista de Administradores" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 ">Lista de Administradores</h3>
                            <Link
                                href={route('admins.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Criar Novo Administrador
                            </Link>
                        </div>

                        {admins?.length > 0 ? (
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Nome
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Criado em
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Cargos
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Permissions
                                            </th>
                                            <th scope="col" className="px-6 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {admins.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.created_at
                                                        ? new Date(user.created_at).toLocaleDateString('pt-BR')
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((role) => (
                                                            <span
                                                                key={role.id}
                                                                className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs font-medium mr-1"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Sem Roles</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.all_permissions && user.all_permissions.length > 0 ? (
                                                        <button
                                                            onClick={() => {
                                                                setAdminSelecionado(user);
                                                                setModalPermissoesAberto(true);
                                                            }}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {user.all_permissions.length} permissões
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Sem Permissions</span>
                                                    )}
                                                </td>
                                                {user.name !== 'Administrador' && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2 justify-end">
                                                            <Link href={route('admins.edit', user.id)}>
                                                                <PencilIcon className="h-5 w-5 text-gray-500" />
                                                            </Link>

                                                            <form
                                                                onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    if (confirm('Deseja realmente excluir este admin?')) {
                                                                        router.delete(route('admins.destroy', user.id));
                                                                    }
                                                                }}
                                                            >
                                                                <button type="submit">
                                                                    <TrashIcon className="h-5 w-5 text-gray-500" />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Nenhum usuário encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
            {modalPermissoesAberto && adminSelecionado && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <button
                            onClick={() => {
                                setModalPermissoesAberto(false);
                                setAdminSelecionado(null);
                            }}
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Permissões de {adminSelecionado.name}
                        </h2>

                        {adminSelecionado.all_permissions.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {adminSelecionado.all_permissions.map((perm) => (
                                    <span
                                        key={perm.id}
                                        className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs font-medium mr-1"
                                    >
                                        {perm.name}
                                    </span>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Este administrador não possui permissões.</p>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
