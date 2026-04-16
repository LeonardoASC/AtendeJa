import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline'

export default function Servicos({ servicos = [] }) {
    const passos = ['Inicio', 'Servico', 'Avaliacao', 'Concluido']

    return (
        <>
            <Head title="Escolha o servico" />

            <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-4 px-4">
                <div className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
                    <div className="relative p-6">
                        <div className="absolute left-8 right-8 top-1/2 -z-10 h-1 mt-10 bg-white/30 rounded-full" />
                        <div
                            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 mt-10 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500"
                            style={{ width: `${(1 / (passos.length - 1)) * 100}%` }}
                        />
                        <div className="flex justify-between">
                            {passos.map((passo, i) => (
                                <div key={passo} className="flex flex-col items-center gap-2">
                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${i <= 1
                                            ? 'border-white bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg'
                                            : 'border-white/40 bg-white/20 text-white/60'
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className={`text-xs md:text-sm ${i <= 1 ? 'text-white' : 'text-white/60'}`}>{passo}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-8 pb-8 text-center">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-left space-y-4 px-4">
                                <div>
                                    <p className="text-4xl lg:text-5xl font-extrabold text-white leading-tight text-center">Avaliacao</p>
                                    <p className="text-4xl lg:text-6xl font-extrabold text-white leading-tight text-center">ATENDE AI</p>
                                    <p className="text-3xl lg:text-4xl font-extrabold text-white leading-tight text-center">PREVMOC</p>
                                </div>

                                <p className="text-lg text-white/90">
                                    Sua opiniao ajuda a melhorar nosso atendimento todos os dias.
                                </p>

                                <div className="space-y-3 text-white/90 text-lg">
                                    <p className="text-xl font-semibold text-white">Como funciona:</p>

                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">1</span>
                                        <p className="pt-1">Escolha o servico que deseja avaliar</p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">2</span>
                                        <p className="pt-1">Selecione uma nota de 1 a 5</p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">3</span>
                                        <p className="pt-1">Envie sua avaliacao em segundos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                {servicos.length === 0 ? (
                                    <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-slate-200">
                                        Nenhum servico disponivel para avaliacao no momento.
                                    </div>
                                ) : (
                                    <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
                                        {servicos.map((servico, index) => (
                                            <motion.div
                                                key={servico.id}
                                                initial={{ opacity: 0, scale: 0.96 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.04 }}
                                            >
                                                <Link
                                                    href={route('avaliacoes.publico.show', servico.slug)}
                                                    className="group relative block overflow-hidden rounded-2xl bg-white border-4 border-double border-sky-700 p-5 text-left shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-teal-600 hover:text-white hover:border-white"
                                                >
                                                    <h2 className="text-xl font-bold text-teal-700 group-hover:text-white capitalize">{servico.nome}</h2>
                                                    {servico.descricao ? (
                                                        <p className="mt-1 text-sm text-teal-700/85 group-hover:text-white/90">{servico.descricao}</p>
                                                    ) : null}

                                                    <div className="mt-3 flex items-center text-sm font-medium text-teal-700 group-hover:text-white">
                                                        Clique para avaliar <CursorArrowRaysIcon className="ml-1 h-4 w-4" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <Link
                                href={route('senhas.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Voltar para o início
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
