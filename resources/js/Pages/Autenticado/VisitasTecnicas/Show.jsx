import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { StatusBadge, formatCpf, formatTelefone, formatDate } from './Index'

const SOLICITANTES = {
    proprio: 'Próprio beneficiário',
    familiar: 'Familiar',
    responsavel: 'Responsável',
    cuidador: 'Cuidador',
    terceiro: 'Terceiro',
}

function Campo({ label, children }) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-400">{label}</dt>
            <dd className="mt-1 text-sm text-white break-words">{children || '-'}</dd>
        </div>
    )
}

function Secao({ titulo, children }) {
    return (
        <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-200">{titulo}</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</dl>
        </section>
    )
}

const formatData = (data) => (data ? new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null)

const condicao = (valor) => {
    if (valor === null || valor === undefined) return null
    return valor ? 'Sim, condição constatada' : 'Não constatada'
}

export default function Show({ visita, historico = [] }) {
    const endereco = [
        [visita.logradouro, visita.numero].filter(Boolean).join(', '),
        visita.complemento,
        visita.bairro,
        visita.cidade,
    ].filter(Boolean).join(' – ')

    return (
        <AuthenticatedLayout>
            <Head title={`Visita ${visita.protocolo}`} />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <Link
                        href={route('visitas-tecnicas.index')}
                        className="inline-flex items-center gap-1 text-sm text-neutral-300 hover:text-white"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Voltar
                    </Link>

                    <header className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">{visita.nome}</h1>
                            <p className="font-mono text-sm text-neutral-400">
                                {visita.protocolo} · Exercício {visita.exercicio}
                            </p>
                        </div>
                        <StatusBadge status={visita.status} />
                    </header>

                    {visita.exige_documentacao_medica && (
                        <div className="flex gap-3 rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-200 ring-1 ring-amber-400/30">
                            <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
                            <p>
                                Em visita anterior não foi constatada condição que justificasse o atendimento domiciliar.
                                O agendamento depende da apresentação de documentação médica (Art. 6º).
                                {visita.documentacao_medica_apresentada && ' Documentação já apresentada.'}
                            </p>
                        </div>
                    )}

                    <Secao titulo="Beneficiário">
                        <Campo label="Nome">{visita.nome}</Campo>
                        <Campo label="CPF">{formatCpf(visita.cpf)}</Campo>
                        <Campo label="Telefone">{formatTelefone(visita.telefone)}</Campo>
                        <Campo label="E-mail">{visita.email}</Campo>
                    </Secao>

                    <Secao titulo="Endereço do atendimento">
                        <Campo label="Endereço">{endereco}</Campo>
                        <Campo label="CEP">{visita.cep?.replace(/(\d{5})(\d{3})/, '$1-$2')}</Campo>
                        <Campo label="Ponto de referência">{visita.ponto_referencia}</Campo>
                    </Secao>

                    <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-200">Justificativa</h2>
                        <p className="whitespace-pre-line text-sm text-white">{visita.justificativa}</p>
                    </section>

                    <Secao titulo="Solicitante">
                        <Campo label="Quem solicitou">{SOLICITANTES[visita.solicitante_tipo] ?? visita.solicitante_tipo}</Campo>
                        {visita.solicitante_tipo !== 'proprio' && (
                            <>
                                <Campo label="Nome do solicitante">{visita.solicitante_nome}</Campo>
                                <Campo label="Telefone do solicitante">{formatTelefone(visita.solicitante_telefone)}</Campo>
                            </>
                        )}
                        <Campo label="Canal">{visita.canal}</Campo>
                        <Campo label="Recebida em">{formatDate(visita.created_at)}</Campo>
                    </Secao>

                    <Secao titulo="Agendamento e visita">
                        <Campo label="Data prevista">{formatData(visita.data_prevista)}</Campo>
                        <Campo label="Servidores designados">{visita.servidores_designados}</Campo>
                        <Campo label="Código de segurança">
                            {visita.codigo_seguranca && <span className="font-mono">{visita.codigo_seguranca}</span>}
                        </Campo>
                        <Campo label="Realizada em">{visita.realizada_em && formatDate(visita.realizada_em)}</Campo>
                        <Campo label="Condição de saúde">{condicao(visita.condicao_constatada)}</Campo>
                        <Campo label="Registrado por">{visita.admin?.name}</Campo>
                        <div className="sm:col-span-2">
                            <Campo label="Observações">
                                {visita.observacoes && <span className="whitespace-pre-line">{visita.observacoes}</span>}
                            </Campo>
                        </div>
                    </Secao>

                    <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-200">
                            Outras solicitações deste CPF
                        </h2>
                        {historico.length === 0 ? (
                            <p className="text-sm text-neutral-400">Nenhuma outra solicitação.</p>
                        ) : (
                            <ul className="divide-y divide-white/10">
                                {historico.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={route('visitas-tecnicas.show', item.id)}
                                            className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-white/5"
                                        >
                                            <span className="font-mono text-sm text-neutral-200">{item.protocolo}</span>
                                            <span className="text-sm text-neutral-400">
                                                Exercício {item.exercicio}
                                                {item.condicao_constatada === false && ' · condição não constatada'}
                                            </span>
                                            <StatusBadge status={item.status} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
