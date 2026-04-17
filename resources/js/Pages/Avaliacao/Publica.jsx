import React from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Angry, Frown, Meh, MessageSquarePlus, Smile, Laugh, X } from 'lucide-react'

export default function Publica({ servico, niveis = [] }) {
    const flash = usePage().props.flash || {}
    const [modalComentarioAberto, setModalComentarioAberto] = React.useState(false)
    const [comentarioTemporario, setComentarioTemporario] = React.useState('')
    const { data, setData, post, processing, errors, reset } = useForm({
        nota: null,
        comentario: '',
    })

    const enviar = (e) => {
        e.preventDefault()

        post(route('avaliacoes.publico.store', servico.slug), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setComentarioTemporario('')
                setModalComentarioAberto(false)
            },
        })
    }

    const passos = ['Início', 'Serviço', 'Avaliação', 'Concluído']

    const obterIconeNivel = (nota) => {
        if (nota === 1) return { Icone: Angry, classe: 'text-rose-400' }
        if (nota === 2) return { Icone: Frown, classe: 'text-orange-300' }
        if (nota === 3) return { Icone: Meh, classe: 'text-amber-300' }
        if (nota === 4) return { Icone: Smile, classe: 'text-lime-300' }
        return { Icone: Laugh, classe: 'text-emerald-300' }
    }

    const abrirModalComentario = () => {
        setComentarioTemporario(data.comentario || '')
        setModalComentarioAberto(true)
    }

    const salvarComentario = () => {
        setData('comentario', comentarioTemporario)
        setModalComentarioAberto(false)
    }

    return (
        <>
            <Head title={`Avaliar ${servico.nome}`} />

            <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-4 px-4">
                <div className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
                    <div className="relative p-6">
                        <div className="absolute left-8 right-8 top-1/2 -z-10 h-1 mt-10 bg-white/30 rounded-full" />
                        <div
                            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 mt-10 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500"
                            style={{ width: `${(2 / (passos.length - 1)) * 100}%` }}
                        />
                        <div className="flex justify-between">
                            {passos.map((passo, i) => (
                                <div key={passo} className="flex flex-col items-center gap-2">
                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${i <= 2
                                            ? 'border-white bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg'
                                            : 'border-white/40 bg-white/20 text-white/60'
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className={`text-xs md:text-sm ${i <= 2 ? 'text-white' : 'text-white/60'}`}>{passo}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="text-left space-y-4 lg:col-span-1">
                                <h1 className="text-4xl lg:text-2xl font-extrabold text-white leading-tight">Avalie o serviço</h1>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white/95 capitalize border border-dotted text-center rounded-lg bg-white/10">{servico.nome}</h2>
                                {servico.descricao ? <p className="text-lg text-white/90">{servico.descricao}</p> : null}

                                <div className="space-y-3 text-white/90 text-lg">
                                    <p className="text-xl font-semibold text-white">Como avaliar:</p>
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8  rounded-full bg-white/20 text-white font-bold">1</span>
                                        <p className="pt-1 text-base/5">Escolha uma carinha que representa sua experiência</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">2</span>
                                        <p className="pt-1 text-base/5">Se quiser, escreva um comentário rápido</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">3</span>
                                        <p className="pt-1 text-base/5">Clique em enviar avaliação</p>
                                    </div>
                                </div>

                                {flash.success ? (
                                    <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/20 px-4 py-3 text-base font-medium text-emerald-50">
                                        {flash.success}
                                    </div>
                                ) : null}
                            </div>

                            <form onSubmit={enviar} className="space-y-6 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur lg:col-span-2">
                                <div>
                                    <label className="block text-lg font-semibold text-white">Avalie o serviço com as informações abaixo</label>
                                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                                        {niveis.map((nivel, index) => {
                                            const ativo = Number(data.nota) === Number(nivel.nota)
                                            const { Icone, classe } = obterIconeNivel(Number(nivel.nota))

                                            return (
                                                <motion.button
                                                    type="button"
                                                    key={nivel.nota}
                                                    onClick={() => setData('nota', nivel.nota)}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className={`rounded-2xl border px-3 py-4 text-center transition ${ativo
                                                        ? 'border-white bg-white text-teal-700 shadow-xl scale-105'
                                                        : 'border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:scale-[1.02]'
                                                        }`}
                                                >
                                                    <span className="flex justify-center py-2">
                                                        <Icone className={`h-20 w-20 ${ativo ? 'text-teal-700' : classe}`} strokeWidth={2.15} />
                                                    </span>
                                                    <span className="mt-1 block text-sm uppercase tracking-wide font-semibold">{nivel.rotulo}</span>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                    {errors.nota ? <p className="mt-2 text-sm text-rose-200">{errors.nota}</p> : null}
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={abrirModalComentario}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                                    >
                                        <MessageSquarePlus className="h-4 w-4" />
                                        {data.comentario ? 'Editar comentário' : 'Adicionar comentário'}
                                    </button>

                                    {data.comentario ? (
                                        <p className="mt-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 truncate line-clamp-2">
                                            Comentário salvo: "{data.comentario}"
                                        </p>
                                    ) : null}

                                    {errors.comentario ? <p className="mt-2 text-sm text-rose-200">{errors.comentario}</p> : null}
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    {/* <Link
                                        href={route('avaliacoes.publico.index')}
                                        className="rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                                    >
                                        Trocar serviço
                                    </Link> */}
                                    {/* botão de voltar para a página anterior*/}
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                                    >
                                        Voltar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.nota}
                                        className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-60"
                                    >
                                        {processing ? 'Enviando...' : 'Enviar solicitação'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {modalComentarioAberto ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="w-full max-w-lg rounded-2xl border border-white/30 bg-white/20 p-5 shadow-2xl backdrop-blur">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Adicionar comentário</h3>
                                <button
                                    type="button"
                                    onClick={() => setModalComentarioAberto(false)}
                                    className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <textarea
                                rows={5}
                                value={comentarioTemporario}
                                onChange={(e) => setComentarioTemporario(e.target.value)}
                                className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none"
                                placeholder="Escreva aqui um comentário sobre seu atendimento."
                            />

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalComentarioAberto(false)}
                                    className="rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={salvarComentario}
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                                >
                                    Salvar comentário
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
        </>
    )
}
