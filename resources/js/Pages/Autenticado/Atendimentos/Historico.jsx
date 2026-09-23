import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
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
    ChatBubbleLeftRightIcon,
    ChatBubbleBottomCenterTextIcon,
    CheckIcon,
    TrashIcon,
    PaintBrushIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/ModalForm';

const PALETA_CORES = [
    { hex: '#10B981', nome: 'Esmeralda' },
    { hex: '#0D9488', nome: 'Teal' },
    { hex: '#2563EB', nome: 'Azul' },
    { hex: '#6366F1', nome: 'Índigo' },
    { hex: '#8B5CF6', nome: 'Roxo' },
    { hex: '#EC4899', nome: 'Rosa' },
    { hex: '#EF4444', nome: 'Vermelho' },
    { hex: '#F59E0B', nome: 'Âmbar' },
    { hex: '#06B6D4', nome: 'Ciano' },
    { hex: '#64748B', nome: 'Ardósia' },
];

const renderTagBadge = (tagName, tagCor) => {
    if (!tagName) return null;
    const hex = (tagCor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tagCor))
        ? tagCor
        : '#0D9488';

    return (
        <span
            style={{
                backgroundColor: `${hex}1A`,
                color: hex,
                borderColor: `${hex}40`,
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold border shadow-2xs"
        >
            <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: hex }}
            />
            <span className="truncate max-w-[150px] sm:max-w-[220px]">{tagName}</span>
        </span>
    );
};

const getInitials = (name) => {
    if (!name) return 'AT';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Historico() {
    const {
        atendimentos = { data: [] },
        filtros = {},
        metricas = {},
        tiposAtendimento = [],
        auth = {},
    } = usePage().props || {};

    const user = auth.admin ?? auth.user;

    const [listaAtendimentos, setListaAtendimentos] = useState(atendimentos);

    useEffect(() => {
        setListaAtendimentos(atendimentos);
    }, [atendimentos]);

    const [selectedAtendimento, setSelectedAtendimento] = useState(null);
    const [historicoCidadao, setHistoricoCidadao] = useState([]);
    const [carregandoHistorico, setCarregandoHistorico] = useState(false);
    const [totalAnteriores, setTotalAnteriores] = useState(0);

    const [formAvaliacao, setFormAvaliacao] = useState({
        tag: '',
        cor: '#0D9488',
        comentario: '',
    });
    const [salvandoAvaliacao, setSalvandoAvaliacao] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState('');
    const [erroAvaliacao, setErroAvaliacao] = useState('');

    useEffect(() => {
        if (selectedAtendimento?.id) {
            setFormAvaliacao({
                tag: selectedAtendimento.avaliacao_tag || '',
                cor: selectedAtendimento.avaliacao_cor || '#0D9488',
                comentario: selectedAtendimento.comentario || '',
            });
            setMensagemSucesso('');
            setErroAvaliacao('');
            carregarHistoricoCidadao(selectedAtendimento);
        } else {
            setHistoricoCidadao([]);
            setTotalAnteriores(0);
            setFormAvaliacao({ tag: '', cor: '#0D9488', comentario: '' });
            setMensagemSucesso('');
            setErroAvaliacao('');
        }
    }, [selectedAtendimento?.id]);

    const carregarHistoricoCidadao = async (atendimento) => {
        setCarregandoHistorico(true);
        try {
            const url = typeof route === 'function'
                ? route('historico-atendimentos.historico-cidadao', atendimento.id)
                : `/admin/historico-atendimentos/${atendimento.id}/historico-cidadao`;

            const res = await axios.get(url);
            if (res.data?.success) {
                setHistoricoCidadao(res.data.outros_atendimentos || []);
                setTotalAnteriores(res.data.total_anteriores || 0);
            }
        } catch (err) {
            console.error('Erro ao buscar histórico do cidadão:', err);
        } finally {
            setCarregandoHistorico(false);
        }
    };

    const salvarAvaliacao = async (e) => {
        if (e) e.preventDefault();
        if (!selectedAtendimento) return;

        if (!formAvaliacao.tag?.trim() && !formAvaliacao.comentario?.trim()) {
            setErroAvaliacao('Informe ao menos uma tag ou comentário para gravar.');
            return;
        }

        setSalvandoAvaliacao(true);
        setMensagemSucesso('');
        setErroAvaliacao('');

        const payload = {
            avaliacao_tag: formAvaliacao.tag?.trim() || '',
            avaliacao_cor: formAvaliacao.cor || '#0D9488',
            comentario: formAvaliacao.comentario?.trim() || '',
        };

        try {
            const url = typeof route === 'function'
                ? route('historico-atendimentos.salvar-avaliacao', selectedAtendimento.id)
                : `/admin/historico-atendimentos/${selectedAtendimento.id}/avaliacao`;

            const res = await axios.post(url, payload);

            if (res.data?.success) {
                const senhaAtualizada = res.data.senha;
                setSelectedAtendimento(senhaAtualizada);
                setMensagemSucesso('Comentário registrado com sucesso!');

                // Recarrega o histórico do cidadão para que o comentário apareça imediatamente ao lado!
                carregarHistoricoCidadao(senhaAtualizada);

                setListaAtendimentos((prev) => {
                    if (!prev?.data) return prev;
                    return {
                        ...prev,
                        data: prev.data.map((item) =>
                            item.id === senhaAtualizada.id ? { ...item, ...senhaAtualizada } : item
                        ),
                    };
                });

                setTimeout(() => setMensagemSucesso(''), 5000);
            }
        } catch (err) {
            console.error('Erro ao salvar avaliação:', err);
            setErroAvaliacao(
                err.response?.data?.message || err.response?.data?.error || 'Erro ao registrar comentário. Tente novamente.'
            );
        } finally {
            setSalvandoAvaliacao(false);
        }
    };

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
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-green-500/30">
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
                        {!listaAtendimentos.data || listaAtendimentos.data.length === 0 ? (
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
                                            {listaAtendimentos.data.map((item) => {
                                                return (
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
                                                            {item.avaliacao_tag && (
                                                                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                                                    {renderTagBadge(item.avaliacao_tag, item.avaliacao_cor)}
                                                                    {item.comentario && (
                                                                        <span
                                                                            title={item.comentario}
                                                                            className="inline-flex items-center text-teal-400/80 hover:text-teal-300 cursor-help"
                                                                        >
                                                                            <ChatBubbleBottomCenterTextIcon className="h-3.5 w-3.5" />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
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
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="lg:hidden divide-y divide-white/10">
                                    {listaAtendimentos.data.map((item) => {
                                        return (
                                            <div key={item.id} className="p-4 hover:bg-white/5 transition space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span className="font-mono text-lg font-bold text-teal-300">
                                                            {item.codigo}
                                                        </span>
                                                        <h3 className="font-medium text-white text-base mt-0.5">
                                                            {item.nome || 'Não informado'}
                                                        </h3>
                                                        {item.avaliacao_tag && (
                                                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                                                {renderTagBadge(item.avaliacao_tag, item.avaliacao_cor)}
                                                                {item.comentario && (
                                                                    <span title={item.comentario} className="text-teal-400">
                                                                        <ChatBubbleBottomCenterTextIcon className="h-3 w-3" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
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
                                        );
                                    })}
                                </div>

                                {listaAtendimentos.links && listaAtendimentos.links.length > 3 && (
                                    <div className="border-t border-white/10 bg-white/[0.02] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-neutral-400">
                                            Mostrando <span className="font-medium text-white">{listaAtendimentos.from || 0}</span> até{' '}
                                            <span className="font-medium text-white">{listaAtendimentos.to || 0}</span> de{' '}
                                            <span className="font-medium text-white">{listaAtendimentos.total || 0}</span> atendimentos
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1">
                                            {listaAtendimentos.links.map((link, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePageChange(link.url)}
                                                            disabled={!link.url}
                                                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${!link.url
                                                                    ? 'text-neutral-600 cursor-not-allowed'
                                                                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                                                }`}
                                                        >
                                                            ← Anterior
                                                        </button>
                                                    );
                                                }

                                                if (index === listaAtendimentos.links.length - 1) {
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePageChange(link.url)}
                                                            disabled={!link.url}
                                                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${!link.url
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
                                                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${link.active
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
                width="max-w-6xl"
            >
                {selectedAtendimento && (
                    <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div>
                                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                                        Código da Senha
                                    </span>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <p className="text-3xl font-black font-mono text-teal-700 tracking-tight">
                                            {selectedAtendimento.codigo}
                                        </p>
                                        {selectedAtendimento.avaliacao_tag && (
                                            renderTagBadge(selectedAtendimento.avaliacao_tag, selectedAtendimento.avaliacao_cor)
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5">
                                <div>{renderStatusBadge(selectedAtendimento.status)}</div>
                                <span className="text-xs text-slate-500 font-medium">
                                    {formatDate(selectedAtendimento.inicio_atendimento || selectedAtendimento.created_at)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                            <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                                            <UserIcon className="h-4 w-4 text-teal-600" />
                                            Informações do Cidadão
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                                                    Nome
                                                </label>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {selectedAtendimento.nome || 'Não informado'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <IdentificationIcon className="h-3.5 w-3.5 text-slate-400" />
                                                    CPF
                                                </label>
                                                <p className="text-sm font-mono text-slate-800">
                                                    {formatCpf(selectedAtendimento.cpf)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">Matrícula</label>
                                                <p className="text-sm font-mono text-slate-800">
                                                    {selectedAtendimento.matricula || 'Não informada'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">E-mail</label>
                                                <p className="text-sm text-slate-800 truncate" title={selectedAtendimento.email}>
                                                    {selectedAtendimento.email || 'Não informado'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                                            <TagIcon className="h-4 w-4 text-teal-600" />
                                            Detalhes do Serviço
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">Tipo de Atendimento</label>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {selectedAtendimento.tipo_atendimento?.nome || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <BuildingOffice2Icon className="h-3.5 w-3.5 text-slate-400" />
                                                    Guichê
                                                </label>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {selectedAtendimento.guiche?.nome ? `Guichê ${selectedAtendimento.guiche.nome}` : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">Atendente</label>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {selectedAtendimento.atendente_nome || user?.name || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                    <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                                                    Tempo de Atendimento
                                                </label>
                                                <p className="text-sm font-mono font-semibold text-teal-700">
                                                    {formatTempo(selectedAtendimento.tempo_atendimento)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">Senha Gerada Em</label>
                                                <p className="text-sm text-slate-800">
                                                    {formatDate(selectedAtendimento.created_at)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500">Início do Atendimento</label>
                                                <p className="text-sm text-slate-800">
                                                    {formatDate(selectedAtendimento.inicio_atendimento)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {Boolean(selectedAtendimento.avaliacao_tag || selectedAtendimento.comentario) ? (
                                    /* Card de Comentário Registrado (Imutável - Inputs Somem) */
                                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                                        <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-700">
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                </span>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                                    Comentário Registrado
                                                </h4>
                                            </div>
                                            {selectedAtendimento.avaliacao_atendente_nome && (
                                                <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                                                    Gravado por <strong>{selectedAtendimento.avaliacao_atendente_nome}</strong>
                                                </span>
                                            )}
                                        </div>

                                        {selectedAtendimento.avaliacao_tag && (
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold text-slate-500 block">
                                                    Tag do Atendimento
                                                </span>
                                                <div>
                                                    {renderTagBadge(selectedAtendimento.avaliacao_tag, selectedAtendimento.avaliacao_cor)}
                                                </div>
                                            </div>
                                        )}

                                        {selectedAtendimento.comentario && (
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold text-slate-500 block">
                                                    Comentário da Atendente
                                                </span>
                                                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-800 text-xs whitespace-pre-wrap leading-relaxed shadow-2xs">
                                                    {selectedAtendimento.comentario}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                                            <span className="flex items-center gap-1.5 text-slate-500">
                                                <LockClosedIcon className="h-3.5 w-3.5 text-slate-400" />
                                                Comentário registrado (não é permitida a edição)
                                            </span>
                                            {selectedAtendimento.avaliado_em && (
                                                <span>
                                                    Gravado em {formatDate(selectedAtendimento.avaliado_em)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Card de Formulário (Quando ainda não possui comentário gravado) */
                                    <div className="bg-white p-5 rounded-2xl border border-teal-200/90 shadow-2xs space-y-4">
                                        <div className="border-b border-teal-200/70 pb-2.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-lg bg-teal-600/10 flex items-center justify-center text-teal-700">
                                                    <PaintBrushIcon className="h-4 w-4" />
                                                </div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                                                    Avaliação deste Atendimento
                                                </h4>
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                Grave um comentário permanente
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                                                <span>Nome da Tag</span>
                                                <span className="text-[10px] text-slate-500 font-normal">Personalizada</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formAvaliacao.tag}
                                                onChange={(e) => setFormAvaliacao((prev) => ({ ...prev, tag: e.target.value }))}
                                                placeholder="Ex: Resolvido, Documentação Pendente, Aguardando Retorno..."
                                                className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-2xs"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700 block">
                                                Cor da Tag (Quadro Hexadecimal)
                                            </label>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {PALETA_CORES.map((c) => {
                                                    const isSelected = (formAvaliacao.cor || '').toUpperCase() === c.hex.toUpperCase();
                                                    return (
                                                        <button
                                                            key={c.hex}
                                                            type="button"
                                                            title={c.nome}
                                                            onClick={() => setFormAvaliacao((prev) => ({ ...prev, cor: c.hex }))}
                                                            className={`h-7 w-7 rounded-full transition-all border-2 flex items-center justify-center ${isSelected
                                                                    ? 'scale-115 border-white ring-2 ring-teal-600 shadow-md'
                                                                    : 'border-white/90 hover:scale-105 opacity-85 hover:opacity-100 shadow-2xs'
                                                                }`}
                                                            style={{ backgroundColor: c.hex }}
                                                        >
                                                            {isSelected && <CheckIcon className="h-3.5 w-3.5 text-white drop-shadow-xs" />}
                                                        </button>
                                                    );
                                                })}

                                                <div className="flex items-center gap-1.5 ml-1">
                                                    <label
                                                        title="Escolher qualquer cor hexadecimal no quadro"
                                                        className="relative h-7 w-7 rounded-full border border-slate-300 hover:border-teal-500 cursor-pointer overflow-hidden flex items-center justify-center bg-white shadow-2xs transition"
                                                    >
                                                        <input
                                                            type="color"
                                                            value={formAvaliacao.cor || '#0D9488'}
                                                            onChange={(e) => setFormAvaliacao((prev) => ({ ...prev, cor: e.target.value }))}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                        />
                                                        <span
                                                            className="h-4 w-4 rounded-full"
                                                            style={{ backgroundColor: formAvaliacao.cor || '#0D9488' }}
                                                        />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={7}
                                                        value={formAvaliacao.cor}
                                                        onChange={(e) => {
                                                            let val = e.target.value;
                                                            if (val && !val.startsWith('#')) val = '#' + val;
                                                            setFormAvaliacao((prev) => ({ ...prev, cor: val }));
                                                        }}
                                                        placeholder="#0D9488"
                                                        className="w-20 text-xs font-mono uppercase rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-2xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-0.5">
                                                {formAvaliacao.tag?.trim() ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] text-slate-500 font-medium">Prévia da tag:</span>
                                                        {renderTagBadge(formAvaliacao.tag.trim(), formAvaliacao.cor)}
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 italic">
                                                        Digite o nome da tag acima para ver a prévia com a cor escolhida.
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-700 block">
                                                Comentário da Atendente
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={formAvaliacao.comentario}
                                                onChange={(e) => setFormAvaliacao((prev) => ({ ...prev, comentario: e.target.value }))}
                                                placeholder="Escreva observações ou orientações sobre este atendimento..."
                                                className="w-full text-xs rounded-xl border border-slate-300 bg-white p-3 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-2xs"
                                            />
                                        </div>

                                        {erroAvaliacao && (
                                            <div className="rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-800 border border-red-200">
                                                {erroAvaliacao}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end pt-1">
                                            <button
                                                type="button"
                                                onClick={salvarAvaliacao}
                                                disabled={salvandoAvaliacao}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition disabled:opacity-50"
                                            >
                                                {salvandoAvaliacao ? (
                                                    <>
                                                        <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                                                        Gravando comentário...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckIcon className="h-3.5 w-3.5" />
                                                        Gravar Comentário
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mensagemSucesso && (
                                    <div className="rounded-xl bg-green-50 p-2.5 text-xs font-medium text-green-800 border border-green-200">
                                        {mensagemSucesso}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-5 bg-slate-100/70 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col h-full">
                                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-teal-600" />
                                            Comentários do Cidadão
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Registros de todos os atendentes
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                                        {historicoCidadao.length} {historicoCidadao.length === 1 ? 'registro' : 'registros'}
                                    </span>
                                </div>

                                <div className="mt-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                                    <span className="font-semibold text-slate-800 truncate">
                                        {selectedAtendimento.nome || 'Cidadão'}
                                    </span>
                                    <span className="font-mono text-slate-500 text-[11px] shrink-0">
                                        CPF: {formatCpf(selectedAtendimento.cpf)}
                                    </span>
                                </div>

                                <div className="mt-3 space-y-3 overflow-y-auto max-h-[580px] pr-1">
                                    {carregandoHistorico ? (
                                        <div className="py-12 text-center text-xs text-slate-400">
                                            <ArrowPathIcon className="mx-auto h-5 w-5 animate-spin text-teal-600 mb-2" />
                                            Carregando comentários...
                                        </div>
                                    ) : historicoCidadao.length === 0 ? (
                                        <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl p-4 bg-white/50">
                                            <ChatBubbleBottomCenterTextIcon className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                                            <p className="font-semibold text-slate-700">Nenhum comentário registrado</p>
                                            <p className="mt-1 text-slate-500">
                                                Este cidadão ainda não possui comentários registrados por atendentes no sistema.
                                            </p>
                                        </div>
                                    ) : (
                                        historicoCidadao.map((item) => {
                                            const isCurrentAttendance = item.id === selectedAtendimento?.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`bg-white rounded-xl p-3.5 border shadow-2xs space-y-2.5 transition ${isCurrentAttendance
                                                            ? 'border-teal-400 ring-1 ring-teal-400/40'
                                                            : 'border-slate-200 hover:border-teal-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="h-6 w-6 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                                                {getInitials(item.avaliacao_atendente_nome || item.atendente_nome)}
                                                            </span>
                                                            <span className="font-semibold text-slate-800 text-xs truncate">
                                                                {item.avaliacao_atendente_nome || item.atendente_nome || 'Atendente'}
                                                            </span>

                                                        </div>
                                                        {item.avaliacao_tag && (
                                                            <div>
                                                                {renderTagBadge(item.avaliacao_tag, item.avaliacao_cor)}
                                                            </div>
                                                        )}
                                                    </div>



                                                    {item.comentario ? (
                                                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 text-xs whitespace-pre-wrap leading-relaxed">
                                                            {item.comentario}
                                                        </div>
                                                    ) : (
                                                        <p className="text-[11px] text-slate-400 italic">
                                                            (Apenas tag registrada, sem comentário de texto)
                                                        </p>
                                                    )}

                                                    <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                                                        <span className="truncate">{item.tipo_atendimento?.nome || 'Atendimento'}</span>
                                                        <span className="shrink-0">{item.guiche?.nome ? `Guichê ${item.guiche.nome}` : renderStatusBadge(item.status)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                            <button
                                onClick={() => setSelectedAtendimento(null)}
                                className="rounded-xl bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300 transition"
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
