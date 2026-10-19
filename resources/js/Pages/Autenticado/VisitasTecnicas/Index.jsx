import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { FunnelIcon, EyeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export const STATUS = {
    pendente: { label: 'Pendente', className: 'bg-yellow-500/20 text-yellow-300' },
    agendada: { label: 'Agendada', className: 'bg-blue-500/20 text-blue-300' },
    realizada: { label: 'Realizada', className: 'bg-green-500/20 text-green-300' },
    cancelada: { label: 'Cancelada', className: 'bg-red-500/20 text-red-300' },
}

export const formatCpf = (cpf) => cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

export const formatTelefone = (telefone) => {
    if (!telefone) return '-'
    return telefone.length === 11
        ? telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        : telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function StatusBadge({ status }) {
    const config = STATUS[status] ?? { label: status, className: 'bg-white/10 text-neutral-300' }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    )
}

export default function Index({ visitas = { data: [] }, filtros = {}, contagem = {}, exercicios = [] }) {
    const [filtrosForm, setFiltrosForm] = useState({
        busca: filtros.busca || '',
        status: filtros.status || '',
        exercicio: filtros.exercicio || '',
    })

    const atualizarFiltro = (campo, valor) => {
        setFiltrosForm((prev) => ({ ...prev, [campo]: valor }))
    }

    const aplicarFiltros = (form = filtrosForm) => {
        router.get(route('visitas-tecnicas.index'), {
            busca: form.busca?.trim() || undefined,
            status: form.status || undefined,
            exercicio: form.exercicio || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        })
    }

    const limparFiltros = () => {
        const vazio = { busca: '', status: '', exercicio: '' }
        setFiltrosForm(vazio)
        aplicarFiltros(vazio)
    }

    const filtrarStatus = (status) => {
        const form = { ...filtrosForm, status: filtrosForm.status === status ? '' : status }
        setFiltrosForm(form)
        aplicarFiltros(form)
    }

    const handlePageChange = (url) => {
        if (!url) return
        router.get(url, {}, { preserveState: true, preserveScroll: true })
    }

    const lista = visitas?.data || []

    return (
        <AuthenticatedLayout>
            <Head title="Visitas Técnicas" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-white">Visitas Técnicas</h1>
                        <p className="text-sm max-w-xl text-neutral-300/80">
                            Solicitações de prova de vida em atendimento domiciliar recebidas pelo formulário público.
                        </p>
                    </header>

                    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {Object.entries(STATUS).map(([status, config]) => (
                            <button
                                key={status}
                                onClick={() => filtrarStatus(status)}
                                className={`rounded-2xl bg-white/5 p-4 text-left ring-1 backdrop-blur transition-all hover:bg-white/10 ${filtrosForm.status === status ? 'ring-cyan-400/60' : 'ring-white/10'}`}
                            >
                                <div className="text-xs uppercase tracking-wide text-neutral-400">{config.label}</div>
                                <div className="mt-1 text-2xl font-semibold text-white">{contagem[status] ?? 0}</div>
                            </button>
                        ))}
                    </div>

                    <section className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur sm:p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-cyan-300" />
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">Filtros</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <input
                                type="text"
                                value={filtrosForm.busca}
                                onChange={(e) => atualizarFiltro('busca', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                                placeholder="Buscar por nome, CPF, protocolo ou e-mail"
                                className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-cyan-400/60 focus:outline-none"
                            />

                            <select
                                value={filtrosForm.status}
                                onChange={(e) => atualizarFiltro('status', e.target.value)}
                                className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                            >
                                <option value="">Todos os status</option>
                                {Object.entries(STATUS).map(([status, config]) => (
                                    <option key={status} value={status}>{config.label}</option>
                                ))}
                            </select>

                            <select
                                value={filtrosForm.exercicio}
                                onChange={(e) => atualizarFiltro('exercicio', e.target.value)}
                                className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                            >
                                <option value="">Todos os exercícios</option>
                                {exercicios.map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => aplicarFiltros()}
                                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
                            >
                                Aplicar filtros
                            </button>
                            <button
                                onClick={limparFiltros}
                                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-neutral-200 ring-1 ring-white/20 hover:bg-white/15"
                            >
                                Limpar
                            </button>
                        </div>
                    </section>

                    <section>
                        {lista.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-slate-200 backdrop-blur">
                                Nenhuma solicitação encontrada.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                                <div className="hidden md:block">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/[0.03]">
                                            <tr>
                                                {['Protocolo', 'Beneficiário', 'CPF', 'Telefone', 'Bairro', 'Recebida em', 'Status', ''].map((titulo) => (
                                                    <th key={titulo} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                        {titulo}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {lista.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5">
                                                    <td className="px-4 py-4 font-mono text-sm text-neutral-200">{item.protocolo}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-white">
                                                        <div className="flex items-center gap-2">
                                                            {item.nome}
                                                            {item.exige_documentacao_medica && (
                                                                <ExclamationTriangleIcon className="h-4 w-4 text-amber-400" title="Exige documentação médica (Art. 6º)" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-neutral-300">{formatCpf(item.cpf)}</td>
                                                    <td className="px-4 py-4 text-sm text-neutral-300">{formatTelefone(item.telefone)}</td>
                                                    <td className="px-4 py-4 text-sm text-neutral-300">{item.bairro || '-'}</td>
                                                    <td className="px-4 py-4 text-sm text-neutral-300">{formatDate(item.created_at)}</td>
                                                    <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                                                    <td className="px-4 py-4 text-right">
                                                        <Link
                                                            href={route('visitas-tecnicas.show', item.id)}
                                                            className="inline-flex items-center gap-1 rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300 ring-1 ring-blue-400/20 hover:bg-blue-500/15"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            Ver
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="md:hidden divide-y divide-white/10">
                                    {lista.map((item) => (
                                        <Link key={item.id} href={route('visitas-tecnicas.show', item.id)} className="block p-4 hover:bg-white/5">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-medium text-white">{item.nome}</h3>
                                                <StatusBadge status={item.status} />
                                            </div>
                                            <p className="mt-1 font-mono text-xs text-neutral-400">{item.protocolo}</p>
                                            <p className="text-sm text-neutral-400">CPF: {formatCpf(item.cpf)}</p>
                                            <p className="text-sm text-neutral-400">{formatTelefone(item.telefone)} · {item.bairro || '-'}</p>
                                            {item.exige_documentacao_medica && (
                                                <p className="mt-1 text-xs text-amber-400">Exige documentação médica (Art. 6º)</p>
                                            )}
                                            <p className="mt-1 text-xs text-neutral-500">{formatDate(item.created_at)}</p>
                                        </Link>
                                    ))}
                                </div>

                                {visitas?.links && visitas.links.length > 3 && (
                                    <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-sm text-neutral-400">
                                            Mostrando <span className="font-medium text-white">{visitas.from || 0}</span> até{' '}
                                            <span className="font-medium text-white">{visitas.to || 0}</span> de{' '}
                                            <span className="font-medium text-white">{visitas.total || 0}</span> resultados
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {visitas.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePageChange(link.url)}
                                                    disabled={!link.url || link.active}
                                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${link.active
                                                        ? 'bg-blue-500 text-white font-medium'
                                                        : !link.url
                                                            ? 'text-neutral-600 cursor-not-allowed'
                                                            : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
