import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ roles, permissions }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        // permissions: [],
    });

    function submit(e) {
        e.preventDefault();
        post(route('admins.store'), {
            onSuccess: () => reset(),
        });
    }

    // function togglePermission(permName) {
    //     if (data.permissions.includes(permName)) {
    //         setData('permissions', data.permissions.filter((p) => p !== permName));
    //     } else {
    //         setData('permissions', [...data.permissions, permName]);
    //     }
    // }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Criar Admin
                </h2>
            }
        >
            <Head title="Criar Admin" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Preencha os dados do novo Admin
                        </h3>
                        <div className="p-4 bg-gray-100 border-l-4 border-blue-500 rounded mb-2">
                            <p className="text-sm text-gray-700">
                                Você pode criar um novo administrador, preenchendo os campos abaixo. O e-mail deve ser único e a senha deve ter pelo menos 6 caracteres.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Nome
                                </label>
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
                                <label className="block mb-1 font-medium text-gray-700">
                                    E-mail
                                </label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para identificação do e-mail do administrador</p>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="Ex: admin@dominio.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="off"
                                />
                                {errors.email && (
                                    <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Senha
                                </label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para identificação da senha do administrador</p>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="No mínimo 6 caracteres"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                />
                                {errors.password && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium text-gray-700">
                                    Confirmar Senha
                                </label>
                                <p className="text-gray-500 text-xs mb-1">Campo utilizado para confirmação da senha do administrador</p>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    placeholder="Confirme sua senha"
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
                                    <p className="text-gray-500 text-xs mb-1">Campo utilizado para atribuição de uma role ao administrador</p>
                                    <select
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="">Selecione uma Role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* {permissions && permissions.length > 0 && (
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700">Permissões</label>
                                    <div className="flex flex-wrap gap-2">
                                        {permissions.map((perm) => (
                                            <button
                                                key={perm.id}
                                                type="button"
                                                onClick={() => togglePermission(perm.name)}
                                                className={
                                                    data.permissions.includes(perm.name)
                                                        ? 'px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
                                                        : 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
                                                }
                                            >
                                                {perm.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    {processing ? 'Enviando...' : 'Salvar'}
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
