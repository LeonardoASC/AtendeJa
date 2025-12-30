import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Sucesso({ solicitacao }) {
    return (
        <>
            <Head title="Solicitação Enviada com Sucesso" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-3xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:p-12 text-center space-y-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center"
                        >
                            <div className="p-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl">
                                <CheckCircleIcon className="h-24 w-24 text-white" />
                            </div>
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                Solicitação Enviada!
                            </h1>
                            <p className="text-xl text-white/90">
                                Sua solicitação foi recebida com sucesso
                            </p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 ring-1 ring-white/20 text-left space-y-4">
                            <h2 className="text-xl font-bold text-white mb-4">Detalhes da Solicitação</h2>

                            <div className="space-y-3 text-white/90">
                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span className="font-semibold">Protocolo:</span>
                                    <span className="text-white font-mono text-lg">#{String(solicitacao.id).padStart(6, '0')}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span className="font-semibold">Tipo:</span>
                                    <span className="text-white">{solicitacao.tipo}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span className="font-semibold">Nome:</span>
                                    <span className="text-white">{solicitacao.nome}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                    <span className="font-semibold">Status:</span>
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/30 text-yellow-100 text-sm font-semibold">
                                        Pendente
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Data/Hora:</span>
                                    <span className="text-white">{solicitacao.created_at}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 ring-1 ring-white/20 text-left">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Próximos Passos
                            </h3>
                            <ul className="space-y-2 text-white/90 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-300 font-bold">1.</span>
                                    <span>Sua solicitação será analisada pela nossa equipe</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-300 font-bold">2.</span>
                                    <span>O prazo de análise pode variar conforme o tipo de solicitação</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-300 font-bold">3.</span>
                                    <span>Você será contatado sobre o andamento</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-300 font-bold">4.</span>
                                    <span>Guarde o número de protocolo para consultas futuras</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4">
                            <Link
                                href={route('senhas.index')}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-lg hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                            >
                                Voltar para o Início
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <img
                        src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                        alt="Logo Prevmoc"
                        className="h-12 bg-white rounded-full p-1 object-contain"
                    />
                    <p className="text-white/80 text-sm">PREVMOC - Instituto de Previdência dos Servidores de Montes Claros</p>
                </div>
            </div>
        </>
    );
}
