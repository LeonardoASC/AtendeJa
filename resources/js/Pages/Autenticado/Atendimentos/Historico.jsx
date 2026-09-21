import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FunnelIcon,
    EyeIcon,
    UserIcon,
    IdentificationIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    TagIcon,
    ArrowPathIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/ModalForm';

export default function Historico() {
    const {
        atendimentos = { data: [] },
        filtros = {},
        metricas = {},
        tiposAtendimento = [],
        auth = {},
    } = usePage().props || {};

    const user = auth.admin ?? auth.user;

    const [selectedAtendimento, setSelectedAtendimento] = useState(null);
    const [filtrosForm, setFiltrosForm] = useState({
        busca: filtros.busca || '',
        data_inicio: filtros.data_inicio || '',
        data_fim: filtros.data_fim || '',
        status: filtros.status || '',
        tipo_atendimento_id: filtros.tipo_atendimento_id || '',
    });

    const atualizarFiltro = (campo, valor) => {
        setFiltrosForm((prev) => ({ ...prev, [campo]: valor }));
    };

    const aplicarFiltros = () => {
        const parametros = {};
        if (filtrosForm.busca?.trim()) parametros.busca = filtrosForm.busca.trim();
        if (filtrosForm.data_inicio) parametros.data_inicio = filtrosForm.data_inicio;
        if (filtrosForm.data_fim) parametros.data_fim = filtrosForm.data_fim;
        if (filtrosForm.status) parametros.status = filtrosForm.status;
        if (filtrosForm.tipo_atendimento_id) parametros.tipo_atendimento_id = filtrosForm.tipo_atendimento_id;

        router.get(route('historico-atendimentos.index'), parametros, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const limparFiltros = () => {
        setFiltrosForm({
            busca: '',
            data_inicio: '',
            data_fim: '',
            status: '',
            tipo_atendimento_id: '',
        });

        router.get(route('historico-atendimentos.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatTempo = (totalSeconds) => {
        if (totalSeconds == null || totalSeconds === '') return '-';
        const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const seg = s % 60;

        if (h > 0) {
            const minStr = m > 0 ? `${m} min` : '';
            return minStr ? `${h}h e ${minStr}` : `${h}h`;
        }
        if (m > 0) {
            return seg > 0 ? `${m} min ${seg} seg` : `${m} min`;
        }
        return `${seg} seg`;
    };

    const formatCpf = (cpf) => {
        if (!cpf) return '-';
        const clean = String(cpf).replace(/\D/g, '');
        if (clean.length !== 11) return cpf;
        return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'atendida':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300 ring-1 ring-green-500/30">
                        <CheckCircleIcon className="h-4 w-4" />
                        Atendida
                    </span>
                );
            case 'cancelada':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-300 ring-1 ring-red-500/30">
                        <XCircleIcon className="h-4 w-4" />
                        Cancelada
                    </span>
                );
            case 'atendendo':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-300 ring-1 ring-yellow-500/30">
                        <ClockIcon className="h-4 w-4 animate-pulse" />
                        Em Atendimento
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-500/20 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                        {status || 'Não definido'}
                    </span>
                );
        }
    };

    const temFiltrosAtivos = Boolean(
        filtrosForm.busca ||
        filtrosForm.data_inicio ||
        filtrosForm.data_fim ||
        filtrosForm.status ||
        filtrosForm.tipo_atendimento_id
    );

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-100">Histórico de Atendimentos</h2>}
        >
            <Head title="Histórico de Atendimentos" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Meu Histórico de Atendimentos
                            </h1>
                            <p className="mt-1 text-sm text-neutral-300/80">
                                Exibindo exclusivamente todos os atendimentos realizados por você ({user?.name || 'Atendente'}).
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-xl bg-teal-500/10 px-3.5 py-2 text-xs font-semibold text-teal-300 ring-1 ring-teal-400/30 backdrop-blur">
                                <UserIcon className="h-4 w-4 text-teal-400" />
                                {user?.name || 'Atendente'}
                            </span>
                        </div>
                    </header>

                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                    Total de Atendimentos
                                </span>
                                <span className="rounded-xl bg-teal-500/20 p-2 text-teal-300">
                                    <TagIcon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                                {metricas.total_geral ?? metricas.total_atendidos ?? 0}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                                {metricas.total_atendidos ?? 0} concluídos · {metricas.total_cancelados ?? 0} cancelados
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                    Concluídos Hoje
                                </span>
                                <span className="rounded-xl bg-green-500/20 p-2 text-green-300">
                                    <CalendarDaysIcon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                                {metricas.total_hoje ?? 0}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">Atendidos por você na data de hoje</p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                    Meu Tempo Médio
                                </span>
                                <span className="rounded-xl bg-blue-500/20 p-2 text-blue-300">
                                    <ClockIcon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                                {formatTempo(metricas.media_tempo)}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">Média de duração dos seus atendimentos</p>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                                    Cancelados
                                </span>
                                <span className="rounded-xl bg-red-500/20 p-2 text-red-300">
                                    <XCircleIcon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                                {metricas.total_cancelados ?? 0}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">Senhas canceladas por você</p>
                        </div>
                    </section>

                    <section className="mb-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur sm:p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FunnelIcon className="h-5 w-5 text-teal-400" />
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
                                    Filtros de Pesquisa
                                </h2>
                            </div>
                            {temFiltrosAtivos && (
                                <button
                                    onClick={limparFiltros}
                                    className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
                                >
                                    <ArrowPathIcon className="h-3.5 w-3.5" />
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            <div className="sm:col-span-2 xl:col-span-2">
                                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    value={filtrosForm.busca}
                                    onChange={(e) => atualizarFiltro('busca', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                                    placeholder="Código (ex: PR-001), Nome, CPF ou Matrícula"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-teal-400/60 focus:outline-none focus:ring-1 focus:ring-teal-400/60"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                                    Status
                                </label>
                                <select
                                    value={filtrosForm.status}
                                    onChange={(e) => atualizarFiltro('status', e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-teal-400/60 focus:outline-none focus:ring-1 focus:ring-teal-400/60"
                                >
                                    <option value="">Todos os status</option>
                                    <option value="atendida">Atendida</option>
                                    <option value="cancelada">Cancelada</option>
                                    <option value="atendendo">Em Atendimento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                                    Tipo de Atendimento
                                </label>
                                <select
                                    value={filtrosForm.tipo_atendimento_id}
                                    onChange={(e) => atualizarFiltro('tipo_atendimento_id', e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-teal-400/60 focus:outline-none focus:ring-1 focus:ring-teal-400/60"
                                >
                                    <option value="">Todos os tipos</option>
                                    {tiposAtendimento.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                                    De
                                </label>
                                <input
                                    type="date"
                                    value={filtrosForm.data_inicio}
                                    onChange={(e) => atualizarFiltro('data_inicio', e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-teal-400/60 focus:outline-none focus:ring-1 focus:ring-teal-400/60"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                                    Até
                                </label>
                                <input
                                    type="date"
                                    value={filtrosForm.data_fim}
                                    onChange={(e) => atualizarFiltro('data_fim', e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-teal-400/60 focus:outline-none focus:ring-1 focus:ring-teal-400/60"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <button
                                onClick={aplicarFiltros}
                                className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                Aplicar filtros
                            </button>
                            {temFiltrosAtivos && (
                                <button
                                    onClick={limparFiltros}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-neutral-200 ring-1 ring-white/20 hover:bg-white/15 transition"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </section>

                    <section className="mt-6">
                        {!atendimentos.data || atendimentos.data.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-slate-300 backdrop-blur">
                                <InformationCircleIcon className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
                                <h3 className="text-lg font-semibold text-white">Nenhum atendimento encontrado</h3>
                                <p className="mt-1 text-sm text-neutral-400">
                                    {temFiltrosAtivos
                                        ? 'Tente ajustar ou limpar os filtros aplicados para visualizar mais resultados.'
                                        : 'Você ainda não possui atendimentos registrados no sistema.'}
                                </p>
                                {temFiltrosAtivos && (
                                    <button
                                        onClick={limparFiltros}
                                        className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/15 transition"
                                    >
                                        Limpar todos os filtros
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/[0.03]">
                                            <tr>
                                                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Código
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Cidadão
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Serviço
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Guichê
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Data / Início
                                                </th>
                                                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Duração
                                                </th>
                                                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {atendimentos.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-mono text-base font-bold text-teal-300">
                                                            {item.codigo}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-white">
                                                            {item.nome || 'Não informado'}
                                                        </div>
                                                        <div className="text-xs text-neutral-400 font-mono">
                                                            CPF: {formatCpf(item.cpf)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-neutral-300 max-w-[220px] truncate">
                                                        {item.tipo_atendimento?.nome || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                                        {item.guiche?.nome ? `Guichê ${item.guiche.nome}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                                        {formatDate(item.inicio_atendimento || item.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 font-mono">
                                                        {formatTempo(item.tempo_atendimento)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {renderStatusBadge(item.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => setSelectedAtendimento(item)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 ring-1 ring-teal-400/20 hover:bg-teal-500/20 transition"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            Detalhes
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="lg:hidden divide-y divide-white/10">
                                    {atendimentos.data.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-white/5 transition space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="font-mono text-lg font-bold text-teal-300">
                                                        {item.codigo}
                                                    </span>
                                                    <h3 className="font-medium text-white text-base mt-0.5">
                                                        {item.nome || 'Não informado'}
                                                    </h3>
                                                </div>
                                                <div>{renderStatusBadge(item.status)}</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
                                                <div>
                                                    <span className="text-neutral-500 block uppercase tracking-wider">CPF</span>
                                                    <span className="font-mono">{formatCpf(item.cpf)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-neutral-500 block uppercase tracking-wider">Serviço</span>
                                                    <span className="truncate block">{item.tipo_atendimento?.nome || '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-neutral-500 block uppercase tracking-wider">Guichê</span>
                                                    <span>{item.guiche?.nome ? `Guichê ${item.guiche.nome}` : '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-neutral-500 block uppercase tracking-wider">Duração</span>
                                                    <span className="font-mono">{formatTempo(item.tempo_atendimento)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                <span className="text-xs text-neutral-400">
                                                    {formatDate(item.inicio_atendimento || item.created_at)}
                                                </span>
                                                <button
                                                    onClick={() => setSelectedAtendimento(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 ring-1 ring-teal-400/20"
                                                >
                                                    <EyeIcon className="h-3.5 w-3.5" />
                                                    Detalhes
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {atendimentos.links && atendimentos.links.length > 3 && (
                                    <div className="border-t border-white/10 bg-white/[0.02] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-neutral-400">
                                            Mostrando <span className="font-medium text-white">{atendimentos.from || 0}</span> até{' '}
                                            <span className="font-medium text-white">{atendimentos.to || 0}</span> de{' '}
                                            <span className="font-medium text-white">{atendimentos.total || 0}</span> atendimentos
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1">
                                            {atendimentos.links.map((link, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePageChange(link.url)}
                                                            disabled={!link.url}
                                                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
                                                                !link.url
                                                                    ? 'text-neutral-600 cursor-not-allowed'
                                                                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >
                                                            ← Anterior
                                                        </button>
                                                    );
                                                }

                                                if (index === atendimentos.links.length - 1) {
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePageChange(link.url)}
                                                            disabled={!link.url}
                                                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
                                                                !link.url
                                                                    ? 'text-neutral-600 cursor-not-allowed'
                                                                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >
                                                            Próximo →
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(link.url)}
                                                        disabled={link.active}
                                                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
                                                            link.active
                                                                ? 'bg-teal-600 text-white font-semibold'
                                                                : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Modal
                isOpen={Boolean(selectedAtendimento)}
                onClose={() => setSelectedAtendimento(null)}
                title={`Detalhes do Atendimento - ${selectedAtendimento?.codigo || ''}`}
                width="max-w-2xl"
            >
                {selectedAtendimento && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-neutral-900/50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Código da Senha</span>
                                <p className="text-3xl font-extrabold font-mono text-teal-700">
                                    {selectedAtendimento.codigo}
                                </p>
                            </div>
                            <div>{renderStatusBadge(selectedAtendimento.status)}</div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
                                Informações do Cidadão
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                        Nome
                                    </label>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {selectedAtendimento.nome || 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <IdentificationIcon className="h-4 w-4 text-gray-400" />
                                        CPF
                                    </label>
                                    <p className="text-sm font-mono text-gray-800">
                                        {formatCpf(selectedAtendimento.cpf)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Matrícula</label>
                                    <p className="text-sm font-mono text-gray-800">
                                        {selectedAtendimento.matricula || 'Não informada'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">E-mail</label>
                                    <p className="text-sm text-gray-800">
                                        {selectedAtendimento.email || 'Não informado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
                                Detalhes do Serviço
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <TagIcon className="h-4 w-4 text-gray-400" />
                                        Tipo de Atendimento
                                    </label>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {selectedAtendimento.tipo_atendimento?.nome || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <BuildingOffice2Icon className="h-4 w-4 text-gray-400" />
                                        Guichê
                                    </label>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {selectedAtendimento.guiche?.nome ? `Guichê ${selectedAtendimento.guiche.nome}` : '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Atendente</label>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {selectedAtendimento.atendente_nome || user?.name || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4 text-gray-400" />
                                        Tempo de Atendimento
                                    </label>
                                    <p className="text-sm font-mono font-semibold text-teal-700">
                                        {formatTempo(selectedAtendimento.tempo_atendimento)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Senha Gerada Em</label>
                                    <p className="text-sm text-gray-800">
                                        {formatDate(selectedAtendimento.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Início do Atendimento</label>
                                    <p className="text-sm text-gray-800">
                                        {formatDate(selectedAtendimento.inicio_atendimento)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setSelectedAtendimento(null)}
                                className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
