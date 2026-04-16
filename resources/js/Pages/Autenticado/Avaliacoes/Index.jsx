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

export default function Index() {
    const {
        servicos = [],
        resumoNotas = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        ultimasAvaliacoes = [],
    } = usePage().props || {}
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirming, setConfirming] = useState(null)
    const [servicosOrdenados, setServicosOrdenados] = useState(servicos)

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

    const totalAvaliacoes = useMemo(() => Object.values(resumoNotas).reduce((acc, item) => acc + Number(item || 0), 0), [resumoNotas])

    const mediaGeral = useMemo(() => {
        if (!totalAvaliacoes) return 0

        const totalPonderado = Object.entries(resumoNotas).reduce((acc, [nota, qtd]) => {
            return acc + Number(nota) * Number(qtd || 0)
        }, 0)

        return Number(totalPonderado / totalAvaliacoes)
    }, [resumoNotas, totalAvaliacoes])

    const onCreate = () => setOpenCreate(true)
    const onEdit = (item) => {
        setEditing(item)
        setOpenEdit(true)
    }
    const onDelete = (item) => setConfirming(item)

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

                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Distribuicao por nota</h3>
                                <div className="mt-3 space-y-2">
                                    {Object.entries(resumoNotas).map(([nota, quantidade]) => (
                                        <div key={nota} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-200">{nota} - {NIVEL_NOTA[Number(nota)]}</span>
                                            <span className="font-semibold text-white">{quantidade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Ultimas avaliacoes</h3>
                                <div className="mt-3 max-h-48 space-y-2 overflow-auto pr-1">
                                    {ultimasAvaliacoes.length === 0 ? (
                                        <p className="text-sm text-slate-300">Ainda nao ha avaliacoes registradas.</p>
                                    ) : ultimasAvaliacoes.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-2 text-sm text-slate-100">
                                            <p className="font-medium">{item.servico_avaliacao?.nome || 'Servico removido'}</p>
                                            <p className="text-xs text-slate-300">Nota {item.nota} - {NIVEL_NOTA[item.nota]}</p>
                                            {item.comentario ? <p className="mt-1 text-xs text-slate-300">"{item.comentario}"</p> : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
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
