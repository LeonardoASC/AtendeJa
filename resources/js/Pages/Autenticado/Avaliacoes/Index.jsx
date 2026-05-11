import React, { useEffect, useMemo, useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import { Bars3Icon, PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Modal from '@/Components/ModalForm'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ServicoAvaliacaoForm from './ServicoAvaliacaoForm'
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const NIVEL_NOTA = {
    1: 'Pessimo',
    2: 'Ruim',
    3: 'Regular',
    4: 'Bom',
    5: 'Otimo',
}

const CORES_NOTA = {
    1: 'bg-rose-500/15 text-rose-200 ring-rose-300/20',
    2: 'bg-orange-500/15 text-orange-200 ring-orange-300/20',
    3: 'bg-sky-500/15 text-sky-200 ring-sky-300/20',
    4: 'bg-emerald-500/15 text-emerald-200 ring-emerald-300/20',
    5: 'bg-amber-400/15 text-amber-200 ring-amber-300/20',
}

const CORES_TEXTO_NOTA = {
    1: 'text-rose-200',
    2: 'text-orange-200',
    3: 'text-sky-200',
    4: 'text-emerald-200',
    5: 'text-amber-200',
}

const CORES_BARRA_NOTA = {
    1: 'bg-rose-400',
    2: 'bg-orange-400',
    3: 'bg-sky-400',
    4: 'bg-emerald-400',
    5: 'bg-amber-300',
}

export default function Index() {
    const {
        servicos = [],
        filtros = {},
        resumoNotas = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        ultimasAvaliacoes = { data: [] },
    } = usePage().props || {}
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirming, setConfirming] = useState(null)
    const [servicosOrdenados, setServicosOrdenados] = useState(servicos)
    const [servicoFiltro, setServicoFiltro] = useState(filtros.servico_id || '')
    const [dataInicioFiltro, setDataInicioFiltro] = useState(filtros.data_inicio || '')
    const [dataFimFiltro, setDataFimFiltro] = useState(filtros.data_fim || '')

    useEffect(() => {
        setServicosOrdenados(servicos)
    }, [servicos])

    const sensores = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    )

    const avaliacoesRecentes = Array.isArray(ultimasAvaliacoes) ? ultimasAvaliacoes : ultimasAvaliacoes.data || []

    const totalDistribuicao = useMemo(() => Object.values(resumoNotas).reduce((acc, item) => acc + Number(item || 0), 0), [resumoNotas])

    const totalAvaliacoes = useMemo(() => {
        return servicos.reduce((acc, item) => acc + Number(item.avaliacoes_count || 0), 0)
    }, [servicos])

    const mediaGeral = useMemo(() => {
        if (!totalAvaliacoes) return 0

        const totalPonderado = servicos.reduce((acc, item) => {
            return acc + Number(item.avaliacoes_avg_nota || 0) * Number(item.avaliacoes_count || 0)
        }, 0)

        return Number(totalPonderado / totalAvaliacoes)
    }, [servicos, totalAvaliacoes])

    const onCreate = () => setOpenCreate(true)
    const onEdit = (item) => {
        setEditing(item)
        setOpenEdit(true)
    }
    const onDelete = (item) => setConfirming(item)

    const aplicarFiltros = ({
        servicoId = servicoFiltro,
        dataInicio = dataInicioFiltro,
        dataFim = dataFimFiltro,
    } = {}) => {
        router.get(route('avaliacoes.index'), {
            servico_id: servicoId || undefined,
            data_inicio: dataInicio || undefined,
            data_fim: dataFim || undefined,
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        })
    }

    const onFiltrarServico = (servicoId) => {
        setServicoFiltro(servicoId)
        aplicarFiltros({ servicoId })
    }

    const limparFiltros = () => {
        setServicoFiltro('')
        setDataInicioFiltro('')
        setDataFimFiltro('')

        router.get(route('avaliacoes.index'), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        })
    }

    const onPageChange = (url) => {
        if (!url) return

        router.get(url, {}, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    const formatarData = (valor) => {
        if (!valor) return null

        return new Date(valor).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const doDelete = () => {
        if (!confirming) return
        router.delete(route('avaliacoes.destroy', confirming.slug), {
            preserveScroll: true,
            onFinish: () => setConfirming(null),
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Avaliacoes" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Avaliacoes</h1>
                            <p className="text-sm text-neutral-300/80">Gerencie os servicos avaliados e acompanhe os resultados.</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onCreate}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white shadow-lg ring-1 ring-white/15 backdrop-blur hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Novo servico
                            </button>
                        </div>
                    </header>

                    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
                        <header className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Servicos cadastrados</h2>
                                <p className="text-sm text-slate-300">Gerencie os servicos, arraste para ordenar e acompanhe os resultados.</p>
                            </div>
                        </header>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <CardMetrica titulo="Total de avaliacoes" valor={String(totalAvaliacoes)} />
                            <CardMetrica titulo="Media geral" valor={mediaGeral ? mediaGeral.toFixed(2) : '0.00'} />
                            <CardMetrica titulo="Servicos ativos" valor={String(servicos.filter((item) => item.ativo).length)} />
                        </div>

                        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-white/[0.03]">
                                    <tr>
                                        <th className="w-14 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Mover</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">Servico</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">Status</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Avaliacoes</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Media</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300">Acoes</th>
                                    </tr>
                                </thead>
                                {servicosOrdenados.length === 0 ? (
                                    <tbody className="divide-y divide-white/10">
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-300">
                                                Nenhum servico cadastrado.
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                                        <SortableContext items={servicosOrdenados.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                            <tbody className="divide-y divide-white/10">
                                                {servicosOrdenados.map((servico) => (
                                                    <LinhaServicoAvaliacao
                                                        key={servico.id}
                                                        servico={servico}
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                    />
                                                ))}
                                            </tbody>
                                        </SortableContext>
                                    </DndContext>
                                )}
                            </table>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Distribuicao por nota</h3>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {totalDistribuicao} {totalDistribuicao === 1 ? 'avaliacao encontrada' : 'avaliacoes encontradas'}
                                    </p>
                                </div>

                                <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-[minmax(220px,1fr)_150px_150px_auto_auto]">
                                    <select
                                        value={servicoFiltro}
                                        onChange={(event) => onFiltrarServico(event.target.value)}
                                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                                       
                                    >
                                        <option style={{background: '#313131'}}  value="">Todos os servicos</option>
                                        {servicos.map((servico) => (
                                            <option style={{background: '#313131'}} key={servico.id} value={servico.id}>{servico.nome}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="date"
                                        value={dataInicioFiltro}
                                        onChange={(event) => setDataInicioFiltro(event.target.value)}
                                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                                    />

                                    <input
                                        type="date"
                                        value={dataFimFiltro}
                                        onChange={(event) => setDataFimFiltro(event.target.value)}
                                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => aplicarFiltros()}
                                        className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
                                    >
                                        Filtrar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={limparFiltros}
                                        className="rounded-xl px-4 py-2 text-sm font-medium bg-white/10 text-slate-300 ring-1 ring-white/15 hover:bg-white/20"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-5">
                                {Object.entries(resumoNotas).map(([nota, quantidade]) => (
                                    <div key={nota} className="rounded-xl border border-white/10 bg-white/5 p-3">
                                        <p className="text-xs uppercase tracking-wide text-slate-400">Nota {nota}</p>
                                        <p className="mt-1 text-sm font-medium text-slate-200">{NIVEL_NOTA[Number(nota)]}</p>
                                        <p className="mt-3 text-2xl font-bold text-white">{quantidade}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Ultimas avaliacoes</h3>
                                {ultimasAvaliacoes.total ? (
                                    <p className="text-xs text-slate-400">
                                        Mostrando {ultimasAvaliacoes.from || 0} ate {ultimasAvaliacoes.to || 0} de {ultimasAvaliacoes.total}
                                    </p>
                                ) : null}
                            </div>

                            <div className="mt-3 space-y-2">
                                {avaliacoesRecentes.length === 0 ? (
                                    <p className="text-sm text-slate-300">Ainda nao ha avaliacoes registradas.</p>
                                ) : avaliacoesRecentes.map((item) => (
                                    <article key={item.id} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 pl-5 text-sm text-slate-100 transition hover:bg-white/[0.07]">
                                        <span className={`absolute inset-y-0 left-0 w-1 ${CORES_BARRA_NOTA[item.nota] || CORES_BARRA_NOTA[3]}`} />

                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${CORES_NOTA[item.nota] || CORES_NOTA[3]}`}>
                                                <span>Nota {item.nota}</span>
                                                <span className="opacity-60">-</span>
                                                <span className={CORES_TEXTO_NOTA[item.nota] || CORES_TEXTO_NOTA[3]}>{NIVEL_NOTA[item.nota]}</span>
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-white">{item.servico_avaliacao?.nome || 'Servico removido'}</p>
                                                {formatarData(item.created_at) ? (
                                                    <p className="mt-0.5 text-xs text-slate-500">{formatarData(item.created_at)}</p>
                                                ) : null}
                                            </div>
                                        </div>

                                        <p className={`mt-3 rounded-lg border border-white/10 bg-black/15 px-3 py-2 leading-relaxed ${item.comentario ? 'text-slate-200' : 'italic text-slate-400'}`}>
                                            {item.comentario || 'Sem comentario registrado.'}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            {ultimasAvaliacoes.links && ultimasAvaliacoes.links.length > 3 && (
                                <div className="mt-4 flex flex-wrap items-center justify-end gap-1 border-t border-white/10 pt-4">
                                    {ultimasAvaliacoes.links.map((link, index) => {
                                        const label = index === 0
                                            ? 'Anterior'
                                            : index === ultimasAvaliacoes.links.length - 1
                                                ? 'Proximo'
                                                : link.label

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => onPageChange(link.url)}
                                                disabled={!link.url || link.active}
                                                className={`rounded-lg px-3 py-1.5 text-sm transition-all ${link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : !link.url
                                                        ? 'cursor-not-allowed text-neutral-600'
                                                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <Modal isOpen={openCreate} onClose={() => setOpenCreate(false)} title="Novo Servico de Avaliacao">
                <ServicoAvaliacaoForm
                    onCancel={() => setOpenCreate(false)}
                    onSuccess={() => setOpenCreate(false)}
                    mode="create"
                />
            </Modal>

            <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} title="Editar Servico de Avaliacao">
                {editing && (
                    <ServicoAvaliacaoForm
                        initialData={editing}
                        onCancel={() => setOpenEdit(false)}
                        onSuccess={() => setOpenEdit(false)}
                        mode="edit"
                    />
                )}
            </Modal>

            <Modal isOpen={!!confirming} onClose={() => setConfirming(null)} title="Confirmar exclusao" width="max-w-md">
                <div className="space-y-5">
                    <p className="text-sm text-neutral-800">
                        Tem certeza que deseja excluir o servico{' '}
                        <span className="font-semibold text-white">{confirming?.nome}</span>?
                    </p>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setConfirming(null)}
                            className="rounded-xl px-4 py-2 text-sm text-neutral-800 ring-1 ring-white/15 hover:bg-white/10"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={doDelete}
                            className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )

    function onDragEnd(event) {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        setServicosOrdenados((listaAnterior) => {
            const indiceAntigo = listaAnterior.findIndex((item) => item.id === active.id)
            const indiceNovo = listaAnterior.findIndex((item) => item.id === over.id)

            if (indiceAntigo === -1 || indiceNovo === -1) {
                return listaAnterior
            }

            const novaLista = arrayMove(listaAnterior, indiceAntigo, indiceNovo)

            router.post(route('avaliacoes.reordenar'), {
                servico_ids: novaLista.map((item) => item.id),
            }, {
                preserveScroll: true,
                preserveState: true,
                onError: () => setServicosOrdenados(listaAnterior),
            })

            return novaLista
        })
    }
}

function LinhaServicoAvaliacao({ servico, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: servico.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.75 : 1,
    }

    return (
        <tr ref={setNodeRef} style={style} className="hover:bg-white/5">
            <td className="px-3 py-4 text-center">
                <button
                    type="button"
                    className="inline-flex cursor-grab active:cursor-grabbing rounded-lg bg-white/5 p-2 text-neutral-300 ring-1 ring-white/10 hover:bg-white/10"
                    aria-label={`Mover ${servico.nome}`}
                    {...attributes}
                    {...listeners}
                >
                    <Bars3Icon className="h-4 w-4" />
                </button>
            </td>
            <td className="px-6 py-4 text-sm text-white">
                <p className="font-medium">{servico.nome}</p>
                <p className="text-xs text-slate-400">/{servico.slug}</p>
            </td>
            <td className="px-6 py-4 text-sm">
                <span className={`rounded-full px-2 py-1 text-xs ${servico.ativo ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-500/20 text-zinc-300'}`}>
                    {servico.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td className="px-6 py-4 text-center text-sm text-white">{servico.avaliacoes_count ?? 0}</td>
            <td className="px-6 py-4 text-center text-sm text-white">
                {servico.avaliacoes_avg_nota ? Number(servico.avaliacoes_avg_nota).toFixed(2) : '0.00'}
            </td>
            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(servico)}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300 ring-1 ring-blue-400/20 hover:bg-blue-500/15"
                    >
                        <PencilSquareIcon className="h-4 w-4" />
                        Editar
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(servico)}
                        className="inline-flex items-center gap-1 rounded-xl bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/15"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Excluir
                    </button>
                </div>
            </td>
        </tr>
    )
}

function CardMetrica({ titulo, valor }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-300">{titulo}</p>
            <p className="mt-1 text-2xl font-bold text-white">{valor}</p>
        </div>
    )
}
