import React, { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function Relatorios(props) {
    const { senhas, filters, availableColumns } = props;

    const columnDefs = useMemo(() => ({
        id: { header: 'ID', render: (s) => s.id },
        cpf: { header: 'CPF', render: (s) => s.cpf },
        tipo: { header: 'Tipo', render: (s) => s.tipo_atendimento ? s.tipo_atendimento.nome : '' },
        status: { header: 'Status', render: (s) => s.status },
        guiche: { header: 'Guichê', render: (s) => s.guiche_id ?? '-' },
        atendente: { header: 'Atendente', render: (s) => s.atendente_nome ?? 'Atendente' },
        criado_em: { header: 'Criado em', render: (s) => new Date(s.created_at).toLocaleString() },
        tempo: { header: 'Tempo atendimento', render: (s) => (s.tempo_atendimento) },
    }), []);

    const [from, setFrom] = useState(filters?.from || '');
    const [to, setTo] = useState(filters?.to || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 25);

    const allKeys = useMemo(() => availableColumns.map(c => c.key), [availableColumns]);
    const [visibleColumns, setVisibleColumns] = useState(
        (filters?.columns?.length ? filters.columns : allKeys)
    );

    const toggleColumn = (key) => {
        setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const submit = (extra = {}) => {
        router.get(
            route('relatorio.index'),
            { from, to, per_page: perPage, 'columns': visibleColumns, ...extra },
            { preserveScroll: true, preserveState: true, replace: true }
        );
    };

    useEffect(() => {
        if (filters?.per_page !== perPage) submit();
    }, [perPage]);

    function formatTempo(totalSeconds) {
        const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const seg = s % 60;

        if (h > 0) {
            const minStr = m > 0 ? `${m} min` : "";
            return minStr ? `${h}h e ${minStr}` : `${h}h`;
        }
        if (m > 0) {
            return `${m} min`;
        }
        return `${seg} seg`;
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-100">Relatórios</h2>}
        >
            <Head title="Relatórios" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <section className="mb-8 text-gray-300">
                        <div className="lg:flex lg:items-center lg:justify-between gap-4">
                            <div className="max-w-prose">
                                <h2 className="text-base font-semibold text-gray-100 mb-2">
                                    Relatórios personalizáveis
                                </h2>
                                <p className="text-sm leading-relaxed">
                                    Abaixo você pode gerar relatórios gerenciais personalizáveis:
                                    selecione o período e marque apenas as colunas que deseja incluir no PDF.
                                </p>
                            </div>

                            <div className="mt-4 lg:mt-0 lg:shrink-0">
                                <a
                                    href={route('relatorios.senhas.pdf', { from, to, 'columns': visibleColumns })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    aria-label="Baixar relatório de senhas em PDF"
                                >
                                    <DocumentArrowDownIcon className="h-5 w-5" />
                                    Baixar PDF
                                </a>
                            </div>
                        </div>
                    </section>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="rounded-xl bg-white/10 p-5 text-gray-100">
                            <h4 className="font-semibold mb-3">Filtro por período</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm opacity-80">De</label>
                                    <input
                                        type="date"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm opacity-80">Até</label>
                                    <input
                                        type="date"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm opacity-80">Por página</label>
                                    <select
                                        value={perPage}
                                        onChange={(e) => setPerPage(parseInt(e.target.value))}
                                        className="w-32 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm"
                                    >
                                        {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => submit({ page: 1 })}
                                        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium hover:bg-teal-500"
                                    >
                                        Aplicar filtros
                                    </button>
                                    {(from || to) && (
                                        <button
                                            onClick={() => { setFrom(''); setTo(''); submit({ page: 1, from: '', to: '' }); }}
                                            className="ml-3 rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-600"
                                        >
                                            Limpar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 rounded-xl bg-white/10 p-5 text-gray-100">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold mb-3">Mostrar/Ocultar colunas</h4>
                                <div className="flex gap-2">
                                    <button
                                        className="rounded-lg bg-neutral-700 px-3 py-1 text-xs hover:bg-neutral-600"
                                        onClick={() => setVisibleColumns(allKeys)}
                                    >
                                        Marcar todas
                                    </button>
                                    <button
                                        className="rounded-lg bg-neutral-700 px-3 py-1 text-xs hover:bg-neutral-600"
                                        onClick={() => setVisibleColumns([])}
                                    >
                                        Desmarcar todas
                                    </button>
                                    <button
                                        className="rounded-lg bg-teal-600 px-3 py-1 text-xs hover:bg-teal-500"
                                        onClick={() => submit()}
                                        title="Aplicar colunas (sem recarregar dados se não precisar)"
                                    >
                                        Aplicar colunas
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {availableColumns.map((c) => (
                                    <label key={c.key} className="flex items-center gap-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={visibleColumns.includes(c.key)}
                                            onChange={() => toggleColumn(c.key)}
                                        />
                                        {c.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {senhas && senhas.data && senhas.data.length > 0 ? (
                        <div className="mt-10 text-gray-300">
                            <h2 className="mb-4 text-lg font-semibold">Senhas</h2>

                            <div className="overflow-auto rounded-xl border border-gray-700">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800">
                                            {visibleColumns.includes('id') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.id.header} </th>}
                                            {visibleColumns.includes('cpf') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.cpf.header} </th>}
                                            {visibleColumns.includes('tipo') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.tipo.header} </th>}
                                            {visibleColumns.includes('status') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.status.header} </th>}
                                            {visibleColumns.includes('guiche') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.guiche.header} </th>}
                                            {visibleColumns.includes('atendente') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.atendente.header} </th>}
                                            {visibleColumns.includes('criado_em') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.criado_em.header} </th>}
                                            {visibleColumns.includes('tempo') && <th className="border border-gray-700 px-4 py-2 text-left"> {columnDefs.tempo.header} </th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {senhas.data.map((s) => (
                                            <tr key={s.id} className="even:bg-gray-900">
                                                {visibleColumns.includes('id') && <td className="border border-gray-700 px-4 py-2">{columnDefs.id.render(s)}</td>}
                                                {visibleColumns.includes('cpf') && <td className="border border-gray-700 px-4 py-2">{columnDefs.cpf.render(s)}</td>}
                                                {visibleColumns.includes('tipo') && <td className="border border-gray-700 px-4 py-2">{columnDefs.tipo.render(s)}</td>}
                                                {visibleColumns.includes('status') && <td className="border border-gray-700 px-4 py-2">{columnDefs.status.render(s)}</td>}
                                                {visibleColumns.includes('guiche') && <td className="border border-gray-700 px-4 py-2">{columnDefs.guiche.render(s)}</td>}
                                                {visibleColumns.includes('atendente') && <td className="border border-gray-700 px-4 py-2">{columnDefs.atendente.render(s)}</td>}
                                                {visibleColumns.includes('criado_em') && <td className="border border-gray-700 px-4 py-2">{columnDefs.criado_em.render(s)}</td>}
                                                {visibleColumns.includes('tempo') && (<td className="border border-gray-700 px-4 py-2">{formatTempo(columnDefs.tempo.render(s))}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {senhas.links && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    {senhas.links.map((link, idx) => {
                                        if (link.url === null) {
                                            return (
                                                <span key={idx} className="px-3 py-1 text-sm rounded border border-gray-700 opacity-50"
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                                            );
                                        }
                                        return (
                                            <button
                                                key={idx}
                                                className={`px-3 py-1 text-sm rounded border ${link.active ? 'bg-teal-600 border-teal-600' : 'border-gray-700 hover:bg-neutral-800'}`}
                                                onClick={() => {
                                                    const url = new URL(link.url);
                                                    const page = url.searchParams.get('page') || 1;
                                                    submit({ page });
                                                }}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="mt-10 text-gray-400">Nenhuma senha encontrada para o período selecionado.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
