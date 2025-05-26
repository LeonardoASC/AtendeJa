import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

const tipos = [
    { label: 'Prova de Vida', value: 'prova_de_vida', prefix: 'PV' },
    { label: 'Processo Administrativo', value: 'processo_administrativo', prefix: 'PA' },
    { label: 'Adiantamento 13°', value: 'adiantamento_13', prefix: 'AD' },
    { label: 'Informações Aposentadoria', value: 'info_aposentadoria', prefix: 'IA' },
    { label: 'Contribuição Previdenciária', value: 'info_contribuicao', prefix: 'CP' },
];

export default function Index() {
    const { data, setData, post, processing, errors, reset } = useForm({
        tipo: '',
        cpf: '',

    });

    function submit(e) {
        e.preventDefault();
        post(route('senhas.store'), {
            onSuccess: () => reset(),
        });
    }

    return (
        <GuestLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Criar Senha</h2>}
        >
            <Head title="Criar Senha" />

            <form onSubmit={submit} className="max-w-md mx-auto space-y-6 bg-white p-6 rounded shadow">
                <div>
                    <label htmlFor="tipo" className="block font-medium text-gray-700">Tipo de Atendimento</label>
                    <select
                        id="tipo"
                        value={data.tipo}
                        onChange={e => setData('tipo', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        <option value="">Selecione...</option>
                        {tipos.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    {errors.tipo && <div className="text-red-600 text-sm mt-1">{errors.tipo}</div>}
                </div>

                <div>
                    <label htmlFor="cpf" className="block font-medium text-gray-700">CPF</label>
                    <input
                        type="text"
                        id="cpf"
                        maxLength={11}
                        value={data.cpf}
                        onChange={e => setData('cpf', e.target.value.replace(/\D/g, ''))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Somente números"
                    />
                    {errors.cpf && <div className="text-red-600 text-sm mt-1">{errors.cpf}</div>}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        {processing ? 'Enviando...' : 'Salvar'}
                    </button>
                    <Link
                        href={route('senhas.index')}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
