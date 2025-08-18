import React, { useMemo, useState } from 'react'
import { Head, usePage, router, useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Modal from '@/Components/ModalForm'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Index() {
    const { guiches: itens = [], tiposAtendimentoOptions = [] } = usePage().props || {}
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirming, setConfirming] = useState(null)

    const list = useMemo(() => [...(itens || [])], [itens])

    const onCreate = () => setOpenCreate(true)
    const onEdit = (item) => { setEditing(item); setOpenEdit(true) }
    const onDelete = (item) => setConfirming(item)

    const doDelete = () => {
        if (!confirming) return
        router.delete(route('guiches.destroy', confirming.id), {
            preserveScroll: true,
            onFinish: () => setConfirming(null),
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Guichês" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Guichês</h1>
                            <p className="text-sm text-neutral-300/80">Gerencie os guichês e seus tipos de atendimento vinculados.</p>
                        </div>

                        <button
                            onClick={onCreate}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white shadow-lg ring-1 ring-white/15 backdrop-blur hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Novo guichê
                        </button>
                    </header>

                    <section className="mt-6">
                        {list.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-white backdrop-blur">
                                Nenhum guichê cadastrado.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                                <div className="hidden sm:block">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/[0.03]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">Guichê</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">Tipos de Atendimento</th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {list.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-4 text-sm font-medium text-white">{item.nome}</td>
                                                    <td className="px-6 py-4 text-sm text-neutral-300">
                                                        {Array.isArray(item.tipos_atendimento) && item.tipos_atendimento.length
                                                            ? item.tipos_atendimento.map(t => t.nome).join(', ')
                                                            : '—'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => onEdit(item)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300 ring-1 ring-blue-400/20 hover:bg-blue-500/15"
                                                            >
                                                                <PencilSquareIcon className="h-4 w-4" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => onDelete(item)}
                                                                className="inline-flex items-center gap-1 rounded-xl bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/15"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="divide-y divide-white/10 sm:hidden">
                                    {list.map((item) => (
                                        <div key={item.id} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-base font-semibold text-white">Guichê {item.nome}</h3>
                                                    <p className="mt-1 text-sm text-neutral-300">
                                                        <span className="font-medium">Tipos:</span>{' '}
                                                        {Array.isArray(item.tipos_atendimento) && item.tipos_atendimento.length
                                                            ? item.tipos_atendimento.map(t => t.nome).join(', ')
                                                            : '—'}
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex gap-2">
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="rounded-lg bg-blue-500/10 p-2 text-blue-300 ring-1 ring-blue-400/20 hover:bg-blue-500/15"
                                                        aria-label="Editar"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="rounded-lg bg-rose-500/10 p-2 text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/15"
                                                        aria-label="Excluir"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
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

            <Modal isOpen={openCreate} onClose={() => setOpenCreate(false)} title="Novo Guichê">
                <GuicheForm
                    tiposAtendimentoOptions={tiposAtendimentoOptions}
                    onCancel={() => setOpenCreate(false)}
                    onSuccess={() => setOpenCreate(false)}
                    mode="create"
                />
            </Modal>

            <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} title="Editar Guichê">
                {editing && (
                    <GuicheForm
                        initialData={{
                            id: editing.id,
                            nome: editing.nome,
                            tipo_atendimento_ids: Array.isArray(editing.tipos_atendimento)
                                ? editing.tipos_atendimento.map(t => t.id)
                                : [],
                        }}
                        tiposAtendimentoOptions={tiposAtendimentoOptions}
                        onCancel={() => setOpenEdit(false)}
                        onSuccess={() => setOpenEdit(false)}
                        mode="edit"
                    />
                )}
            </Modal>

            <Modal isOpen={!!confirming} onClose={() => setConfirming(null)} title="Confirmar exclusão" width="max-w-md">
                <div className="space-y-5">
                    <p className="text-sm text-neutral-800">
                        Tem certeza que deseja excluir o guichê{' '}
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
}

function GuicheForm({ initialData = null, tiposAtendimentoOptions = [], onCancel, onSuccess, mode = 'create' }) {
    const isEdit = mode === 'edit'
    const initialTipoIds = Array.isArray(initialData?.tipo_atendimento_ids) ? initialData.tipo_atendimento_ids : []
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nome: initialData?.nome ?? '',
        tipo_atendimento_ids: initialTipoIds,
    })

    const safeIds = Array.isArray(data.tipo_atendimento_ids) ? data.tipo_atendimento_ids : []

    const toggleTipo = (id) => {
        setData((curr) => {
            const base = Array.isArray(curr.tipo_atendimento_ids) ? curr.tipo_atendimento_ids : []
            const set = new Set(base)
            if (set.has(id)) set.delete(id)
            else set.add(id)
            return { ...curr, tipo_atendimento_ids: Array.from(set) }
        })
    }

    const submit = (e) => {
        e.preventDefault()
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                reset('nome', 'tipo_atendimento_ids')
                onSuccess?.()
            },
        }
        if (isEdit && initialData?.id) {
            put(route('guiches.update', initialData.id), opts)
        } else {
            post(route('guiches.store'), opts)
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-800">Identificador Guichê</label>
                    <input
                        type="text"
                        value={data.nome}
                        onChange={(e) => setData('nome', e.target.value)}
                        className={`w-full rounded-2xl border px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 bg-white/5 backdrop-blur ${errors.nome ? 'border-rose-400/40 ring-rose-400/30' : 'border-white/10 ring-white/10'
                            }`}
                        placeholder="Ex.: 01 / Nome atendente"
                    />
                    {errors.nome && <p className="mt-1 text-xs text-rose-300">{errors.nome}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-800">Tipos de atendimento</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {tiposAtendimentoOptions.length === 0 && (
                            <p className="text-sm text-neutral-600">Nenhum tipo de atendimento disponível.</p>
                        )}
                        {tiposAtendimentoOptions.map((t) => {
                            const checked = safeIds.includes(t.id)
                            return (
                                <label
                                    key={t.id}
                                    className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm text-neutral-800 bg-white/5 backdrop-blur cursor-pointer ${checked ? 'border-blue-400/30 ring-1 ring-blue-400/30' : 'border-white/10'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-white/20 bg-black/20"
                                        checked={checked}
                                        onChange={() => toggleTipo(t.id)}
                                    />
                                    <span>{t.nome}</span>
                                </label>
                            )
                        })}
                    </div>
                    {errors['tipo_atendimento_ids'] && (
                        <p className="mt-1 text-xs text-rose-300">{errors['tipo_atendimento_ids']}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl px-4 py-2 text-sm text-neutral-800 ring-1 ring-white/15 hover:bg-white/10"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-neutral-800 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? <Spinner /> : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={isEdit ? 'salvar' : 'criar'}
                                initial={{ y: 6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -6, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isEdit ? 'Salvar alterações' : 'Criar guichê'}
                            </motion.span>
                        </AnimatePresence>
                    )}
                </button>
            </div>
        </form>
    )
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    )
}
