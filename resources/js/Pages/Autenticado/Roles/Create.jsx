import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ permissions }) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        guard_name: 'admin',
        permissions: [],
    });

    function submit(e) {
        e.preventDefault();
        post(route('roles.store'));
    }

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

    const togglePermission = (id) => {
        setData(
            'permissions',
            data.permissions.includes(id)
                ? data.permissions.filter((p) => p !== id)
                : [...data.permissions, id]
        );
    };

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
            header={<h2 className="text-xl font-semibold text-gray-800">Criar Cargo</h2>}
        >
            <Head title="Criar Cargo" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Preencha os dados do cargo
                        </h3>
                        <div className="p-4 bg-gray-100 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-gray-700">
                                Você pode selecionar as permissões que deseja atribuir a este cargo.
                                <br />
                                As permissões estão divididas em quatro categorias: Ver, Criar, Editar e Excluir.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 mt-2">
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {processing ? 'Enviando...' : 'Salvar'}
                                </button>
                                <Link
                                    href={route('roles.index')}
                                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
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
