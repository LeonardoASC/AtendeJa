import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Usuarios({ users }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Usuários</h2>}
        >
            <Head title="Lista de Usuários" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 ">Lista de Usuários</h3>
                            {/* <Link
                                href={route('users.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Criar Novo Usuário
                            </Link> */}
                        </div>

                        {users?.length > 0 ? (
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
                                                Roles
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
                                        {users.map((user) => (
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
                                                    {user.permissions && user.permissions.length > 0 ? (
                                                        user.permissions.map((perm) => (
                                                            <span
                                                                key={perm.id}
                                                                className="inline-block bg-green-100 text-green-800 rounded px-2 py-1 text-xs font-medium mr-1"
                                                            >
                                                                {perm.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Sem Permissions</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {/* <Link
                                                        href={route('users.edit', user.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        href={route('users.show', user.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Ver
                                                    </Link> */}
                                                </td>
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
        </AuthenticatedLayout>
    );
}
