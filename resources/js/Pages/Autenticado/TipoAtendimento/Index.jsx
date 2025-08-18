import React, { useMemo, useState } from 'react'
import { Head, usePage, router, useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Modal from '@/Components/ModalForm'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Index() {
    const { tipoAtendimentos: itens = [] } = usePage().props || {}
    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirming, setConfirming] = useState(null)

    const onCreate = () => setOpenCreate(true)
    const onEdit = (item) => {
        setEditing(item)
        setOpenEdit(true)
    }
    const onDelete = (item) => setConfirming(item)

    const doDelete = () => {
        if (!confirming) return
        router.delete(route('tipo-atendimentos.destroy', confirming.id), {
            preserveScroll: true,
            onSuccess: () => setConfirming(null),
            onFinish: () => setConfirming(null),
        })
    }

    const list = useMemo(() => [...(itens || [])], [itens])

    return (
        <AuthenticatedLayout>
            <Head title="Tipos de Atendimento" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <header className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Tipos de Atendimento</h1>
                            <p className="text-sm text-neutral-300/80">
                                Gerencie os tipos, guichês e ações.
                            </p>
                        </div>

                        <button
                            onClick={onCreate}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white shadow-lg ring-1 ring-white/15 backdrop-blur hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Novo tipo
                        </button>
                    </header>

                    <section className="mt-6">
                        {list.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-slate-200 backdrop-blur">
                                <p>
                                    Nenhum tipo cadastrado ainda. Clique em <span className="font-semibold text-white underline">Novo tipo</span>.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur">
                                <div className="hidden sm:block">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/[0.03]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Nome do atendimento
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {list.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5">
                                                    <td className="px-6 py-4 text-sm font-medium text-white">
                                                        {item.nome}
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
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Modal isOpen={openCreate} onClose={() => setOpenCreate(false)} title="Novo Tipo de Atendimento">
                <TipoAtendimentoForm
                    onCancel={() => setOpenCreate(false)}
                    onSuccess={() => setOpenCreate(false)}
                    mode="create"
                />
            </Modal>

            <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} title="Editar Tipo de Atendimento">
                {editing && (
                    <TipoAtendimentoForm
                        initialData={editing}
                        onCancel={() => setOpenEdit(false)}
                        onSuccess={() => setOpenEdit(false)}
                        mode="edit"
                    />
                )}
            </Modal>

            <Modal isOpen={!!confirming} onClose={() => setConfirming(null)} title="Confirmar exclusão" width="max-w-md">
                <div className="space-y-5">
                    <p className="text-sm text-gray-700">
                        Tem certeza que deseja excluir{' '}
                        <span className="font-semibold text-white">{confirming?.nome}</span>? Essa ação não pode ser desfeita.
                    </p>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setConfirming(null)}
                            className="rounded-xl px-4 py-2 text-sm text-gray-700 ring-1 ring-white/15 hover:bg-white/10"
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

function TipoAtendimentoForm({ initialData = null, onCancel, onSuccess, mode = 'create' }) {
    const isEdit = mode === 'edit'
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nome: initialData?.nome ?? '',
        guiche: initialData?.guiche ?? '',
    })

    const submit = (e) => {
        e.preventDefault()
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                reset('nome', 'guiche')
                onSuccess?.()
            },
        }

        if (isEdit && initialData?.id) {
            put(route('tipo-atendimentos.update', initialData.id), opts)
        } else {
            post(route('tipo-atendimentos.store'), opts)
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nome do Atendimento</label>
                    <input
                        type="text"
                        value={data.nome}
                        onChange={(e) => setData('nome', e.target.value)}
                        className={`w-full  rounded-2xl border px-3 py-2.5 text-sm text-black placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 bg-white/5 backdrop-blur ${errors.nome ? 'border-rose-400/40 ring-rose-400/30' : 'border-white/10 ring-white/10'
                            }`}
                        placeholder="Ex.: Atendimento Geral"
                    />
                    {errors.nome && <p className="mt-1 text-xs text-rose-300">{errors.nome}</p>}
                </div>

            </div>

            <div className="flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl px-4 py-2 text-sm text-gray-700 ring-1 ring-white/15 hover:bg-white/10"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-gray-700 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? (
                        <Spinner />
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={isEdit ? 'salvar' : 'criar'}
                                initial={{ y: 6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -6, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isEdit ? 'Salvar alterações' : 'Criar tipo'}
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
