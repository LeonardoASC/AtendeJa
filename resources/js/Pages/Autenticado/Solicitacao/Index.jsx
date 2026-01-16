import React, { useState } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
    DocumentTextIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    CalendarIcon,
    EnvelopeIcon,
    PhoneIcon,
    IdentificationIcon,
    EyeIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Modal from '@/Components/ModalForm'

export default function Index() {
    const { solicitacoesPendentes = [], solicitacoesEnviadas = [], filaJobs = 0 } = usePage().props || {}
    const [activeTab, setActiveTab] = useState('pendente')
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null)

    const tabs = [
        { id: 'pendente', label: 'Pendentes', count: solicitacoesPendentes.length },
        { id: 'enviado', label: 'Enviados', count: solicitacoesEnviadas.length }
    ]

    const currentList = activeTab === 'pendente' ? solicitacoesPendentes : solicitacoesEnviadas

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const viewDetails = (solicitacao) => {
        setSelectedSolicitacao(solicitacao)
    }

    const marcarComoEnviado = (id) => {
        if (confirm('Deseja marcar esta solicitação como enviada?')) {
            router.post(route('solicitacoes.marcar-enviado', id), {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedSolicitacao(null)
            })
        }
    }

    const visualizarPdf = (id) => {
        window.open(route('solicitacoes.visualizar-pdf', id), '_blank')
    }

    return (
        <AuthenticatedLayout>
            <Head title="Atender Solicitações" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Solicitações</h1>
                            <p className="text-sm max-w-md text-neutral-300/80">
                                Solicitacões aqui apenas sao gerenciadas pelo operador quando ha falha no envio automático para 1DOC.
                            </p>
                        </div>
                        {filaJobs > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 max-w-md inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300"
                            >
                                <ClockIcon className="h-4 w-4 animate-pulse" />
                                Há {filaJobs} {filaJobs < 2 ? 'solicitação' : 'solicitações'} na fila de envio automático para 1DOC.
                            </motion.div>
                        )}
                    </header>

                    <div className="mb-6 flex gap-2 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/5 text-neutral-500'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <section className="mt-6">
                        {currentList.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-slate-200 backdrop-blur">
                                <p>
                                    Nenhuma solicitação{' '}
                                    <span className="font-semibold text-white">
                                        {activeTab === 'pendente' ? 'pendente' : 'enviada'}
                                    </span>{' '}
                                    no momento.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                                <div className="hidden sm:block">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/[0.03]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Nome
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    CPF
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Tipo Atendimento
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Data/Hora
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {currentList.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-4 text-sm font-medium text-white">
                                                        {item.nome}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-neutral-300">
                                                        {item.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-neutral-300">
                                                        {item.tipo_atendimento?.nome || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-neutral-300">
                                                        {formatDate(item.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {item.status === 'pendente' ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-300">
                                                                <ClockIcon className="h-4 w-4" />
                                                                Pendente
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300">
                                                                <CheckCircleIcon className="h-4 w-4" />
                                                                Enviado
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => viewDetails(item)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300 ring-1 ring-blue-400/20 hover:bg-blue-500/15"
                                                            >
                                                                Ver detalhes
                                                            </button>
                                                            <button
                                                                onClick={() => visualizarPdf(item.id)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-purple-500/10 px-3 py-1.5 text-sm text-purple-300 ring-1 ring-purple-400/20 hover:bg-purple-500/15"
                                                            >
                                                                <EyeIcon className="h-4 w-4" />
                                                                PDF
                                                            </button>
                                                            {item.status === 'pendente' && (
                                                                <button
                                                                    onClick={() => marcarComoEnviado(item.id)}
                                                                    className="inline-flex items-center gap-1 rounded-xl bg-green-500/10 px-3 py-1.5 text-sm text-green-300 ring-1 ring-green-400/20 hover:bg-green-500/15"
                                                                >
                                                                    <CheckCircleIcon className="h-4 w-4" />
                                                                    Marcar enviado
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="sm:hidden divide-y divide-white/10">
                                    {currentList.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-white/5">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-medium text-white">{item.nome}</h3>
                                                    {item.status === 'pendente' ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-300">
                                                            <ClockIcon className="h-3 w-3" />
                                                            Pendente
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">
                                                            <CheckCircleIcon className="h-3 w-3" />
                                                            Enviado
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-neutral-400">
                                                    CPF: {item.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                                </p>
                                                <p className="text-sm text-neutral-400">
                                                    {item.tipo_atendimento?.nome || '-'}
                                                </p>
                                                <p className="text-xs text-neutral-500">{formatDate(item.created_at)}</p>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => viewDetails(item)}
                                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-blue-500/10 px-3 py-2 text-sm text-blue-300 ring-1 ring-blue-400/20"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                        Ver
                                                    </button>
                                                    <button
                                                        onClick={() => visualizarPdf(item.id)}
                                                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-purple-500/10 px-3 py-2 text-sm text-purple-300 ring-1 ring-purple-400/20"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                        PDF
                                                    </button>
                                                    {item.status === 'pendente' && (
                                                        <button
                                                            onClick={() => marcarComoEnviado(item.id)}
                                                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-green-500/10 px-3 py-2 text-sm text-green-300 ring-1 ring-green-400/20"
                                                        >
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            Enviar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Modal
                isOpen={!!selectedSolicitacao}
                onClose={() => setSelectedSolicitacao(null)}
                title="Detalhes da Solicitação"
                width="max-w-3xl"
            >
                {selectedSolicitacao && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <UserIcon className="h-4 w-4" />
                                    Nome
                                </label>
                                <p className="text-sm text-white font-medium">{selectedSolicitacao.nome}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <IdentificationIcon className="h-4 w-4" />
                                    CPF
                                </label>
                                <p className="text-sm text-white">
                                    {selectedSolicitacao.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <EnvelopeIcon className="h-4 w-4" />
                                    E-mail
                                </label>
                                <p className="text-sm text-white">{selectedSolicitacao.email || '-'}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <PhoneIcon className="h-4 w-4" />
                                    Telefone
                                </label>
                                <p className="text-sm text-white">{selectedSolicitacao.telefone || '-'}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Matrícula
                                </label>
                                <p className="text-sm text-white">{selectedSolicitacao.matricula || '-'}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <DocumentTextIcon className="h-4 w-4" />
                                    Tipo Atendimento
                                </label>
                                <p className="text-sm text-white">{selectedSolicitacao.tipo_atendimento?.nome || '-'}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    Data/Hora
                                </label>
                                <p className="text-sm text-white">{formatDate(selectedSolicitacao.created_at)}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Status
                                </label>
                                <div>
                                    {selectedSolicitacao.status === 'pendente' ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-300">
                                            <ClockIcon className="h-4 w-4" />
                                            Pendente
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Enviado
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedSolicitacao.dados_formulario && Object.keys(selectedSolicitacao.dados_formulario).length > 0 && (
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-sm font-semibold text-white mb-3">Dados do Formulário</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.entries(selectedSolicitacao.dados_formulario).map(([key, value]) => (
                                        <div key={key} className="space-y-1">
                                            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                {key}
                                            </label>
                                            <p className="text-sm text-white">{value || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedSolicitacao.anexo && (
                            <div className="border-t border-white/10 pt-4">
                                <h4 className="text-sm font-semibold text-white mb-3">Anexo (Foto e Assinatura)</h4>
                                <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                    <iframe
                                        src={route('solicitacoes.visualizar-pdf', selectedSolicitacao.id)}
                                        className="w-full h-[600px]"
                                        title="PDF da Solicitação"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
                            <button
                                onClick={() => setSelectedSolicitacao(null)}
                                className="rounded-xl px-4 py-2 text-sm text-gray-700 ring-1 ring-white/15 hover:bg-white/10"
                            >
                                Fechar
                            </button>
                            {selectedSolicitacao.status === 'pendente' && (
                                <button
                                    onClick={() => marcarComoEnviado(selectedSolicitacao.id)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                                >
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Marcar como enviado
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    )
}
