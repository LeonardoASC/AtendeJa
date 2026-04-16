import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ServicoAvaliacaoForm({ initialData = null, onCancel, onSuccess, mode = 'create' }) {
    const isEdit = mode === 'edit'

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nome: initialData?.nome ?? '',
        descricao: initialData?.descricao ?? '',
        ativo: initialData?.ativo ?? true,
    })

    const submit = (e) => {
        e.preventDefault()

        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                reset('nome', 'descricao', 'ativo')
                onSuccess?.()
            },
        }

        if (isEdit && initialData?.slug) {
            put(route('avaliacoes.update', initialData.slug), opts)
            return
        }

        post(route('avaliacoes.store'), opts)
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-800">Nome do Servico</label>
                    <input
                        type="text"
                        value={data.nome}
                        onChange={(e) => setData('nome', e.target.value)}
                        className={`w-full rounded-2xl border px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 bg-white/5 backdrop-blur ${errors.nome ? 'border-rose-400/40 ring-rose-400/30' : 'border-white/10 ring-white/10'}`}
                        placeholder="Ex.: Atendimento presencial"
                    />
                    {errors.nome && <p className="mt-1 text-xs text-rose-300">{errors.nome}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-800">Descricao</label>
                    <textarea
                        value={data.descricao}
                        onChange={(e) => setData('descricao', e.target.value)}
                        rows={3}
                        className={`w-full rounded-2xl border px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 bg-white/5 backdrop-blur ${errors.descricao ? 'border-rose-400/40 ring-rose-400/30' : 'border-white/10 ring-white/10'}`}
                        placeholder="Texto curto para orientar o usuario"
                    />
                    {errors.descricao && <p className="mt-1 text-xs text-rose-300">{errors.descricao}</p>}
                </div>

                <div>
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!data.ativo}
                            onChange={(e) => setData('ativo', e.target.checked)}
                            className="h-4 w-4 rounded border-white/20 bg-black/20"
                        />
                        Servico ativo
                    </label>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl px-4 py-2 text-sm text-neutral-800 ring-1 ring-white/15 hover:bg-white/10"
                    >
                        Cancelar
                    </button>
                ) : (
                    <Link
                        href={route('avaliacoes.index')}
                        className="rounded-xl px-4 py-2 text-sm text-neutral-800 ring-1 ring-white/15 hover:bg-white/10"
                    >
                        Cancelar
                    </Link>
                )}

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
                                {isEdit ? 'Salvar alteracoes' : 'Criar servico'}
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
