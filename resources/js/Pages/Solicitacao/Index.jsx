import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CursorArrowRaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Index({ tiposAtendimento }) {
    return (
        <>
            <Head title="Solicitações - Escolha o Serviço" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <div className="py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="text-left space-y-4 px-4">
                                    <div>
                                        <p className="text-5xl lg:text-5xl font-extrabold text-white leading-tight text-center">Faça sua</p>
                                        <p className="text-5xl lg:text-7xl font-extrabold text-white leading-tight text-center">SOLICITAÇÃO</p>
                                        <div className='flex items-center justify-center gap-4'>
                                            <p className="text-5xl lg:text-5xl font-extrabold text-white leading-tight text-center">ONLINE!</p>
                                            <img
                                                src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                                alt="Logo Prevmoc"
                                                className='h-14 bg-white rounded-full p-1 mb-2 object-contain'
                                            />
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/90">
                                        Nosso sistema para fazer solicitações de forma rápida e prática.
                                    </p>

                                    <div className="space-y-4 text-white/90 text-lg">
                                        <p className="text-xl font-semibold text-white">
                                            Como funciona:
                                        </p>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    1
                                                </span>
                                                <p className="pt-1">
                                                    Escolha o tipo de solicitação desejada
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    2
                                                </span>
                                                <p className="pt-1">
                                                    Preencha o formulário com seus dados
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    3
                                                </span>
                                                <p className="pt-1">
                                                    Assine digitalmente e tire uma foto
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    4
                                                </span>
                                                <p className="pt-1">
                                                    Pronto! Sua solicitação será processada
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="text-white/90">
                                            <p className="font-semibold mb-2">Informações Importantes:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Tenha em mãos seus documentos e informações pessoais</li>
                                                <li>• O prazo de análise pode variar conforme o tipo de solicitação</li>
                                                <li>• Você será notificado sobre o andamento da sua solicitação</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 items-center justify-center px-4">
                                    <div className="w-full max-w-lg">
                                        <h2 className="text-2xl font-bold text-white text-center mb-6">
                                            Escolha o Tipo de Solicitação
                                        </h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {tiposAtendimento.map((tipo, index) => (
                                                <motion.div
                                                    key={tipo.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Link
                                                        href={route('solicitacoes.create', { tipo: tipo.id })}
                                                        className="group relative overflow-hidden rounded-xl bg-white/15 backdrop-blur-md p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/25 ring-1 ring-white/20 hover:ring-white/40 min-h-[120px] flex flex-col items-center justify-center"
                                                    >
                                                        <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-300 text-white shadow-lg group-hover:scale-110 transition-transform">
                                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>

                                                        <h3 className="text-lg font-bold text-white leading-tight mb-2">
                                                            {tipo.nome}
                                                        </h3>

                                                        <div className="flex gap-2 items-center text-white/80 text-sm">
                                                            Clique para solicitar
                                                            <CursorArrowRaysIcon className="h-5 w-5 text-white" />
                                                        </div>

                                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {tiposAtendimento.length === 0 && (
                                            <div className="text-center py-12">
                                                <p className="text-white/80 text-lg">
                                                    Nenhum tipo de solicitação disponível no momento.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                </motion.div>

            </div>
        </>
    );
}
