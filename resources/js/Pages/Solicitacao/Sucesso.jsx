import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Sucesso({ solicitacao }) {
    return (
        <>
            <Head title="Solicitação Enviada com Sucesso" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-left space-y-4 px-4 ">
                                <div>
                                    <p className="text-4xl lg:text-4xl font-extrabold text-white leading-tight text-center">SOLICITAÇÃO</p>
                                    <p className="text-4xl lg:text-6xl font-extrabold text-white leading-tight text-center">ENVIADA!</p>
                                    <div className='flex items-center justify-center gap-4'>
                                        <p className="text-4xl lg:text-4xl font-extrabold text-white leading-tight text-center">COM SUCESSO</p>
                                        <img
                                            src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                            alt="Logo Prevmoc"
                                            className='h-14 bg-white rounded-full p-1 mb-2 object-contain'
                                        />
                                    </div>
                                </div>

                                <p className="text-lg text-white/90">
                                    Sua solicitação foi recebida e será processada pela nossa equipe.
                                </p>

                                <div className="space-y-1 text-white/90 text-lg">
                                    <p className="text-xl font-semibold text-white">
                                        O que acontece agora:
                                    </p>

                                    <div className="space-y-1">
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                1
                                            </span>
                                            <p className="">
                                                Sua solicitação será <strong>analisada</strong> pela equipe técnica
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                2
                                            </span>
                                            <p className="">
                                                O prazo de análise pode variar conforme a complexidade
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                3
                                            </span>
                                            <p className="">
                                                Você será <strong>contatado</strong> sobre o andamento
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                4
                                            </span>
                                            <p className="">
                                                Guarde o <strong>protocolo</strong> para consultas futuras
                                            </p>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            <div className="flex flex-col gap-2 items-center justify-center px-4">
                                <div className="w-4/5 pt-4">
                                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/20">
                                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <DocumentTextIcon className="h-5 w-5" />
                                            Detalhes da Solicitação
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70 font-medium">Protocolo:</span>
                                                <span className="text-white font-mono text-lg font-bold">#{String(solicitacao.id).padStart(6, '0')}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70 font-medium">Tipo:</span>
                                                <span className="text-white font-medium">{solicitacao.tipo}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70 font-medium">Nome:</span>
                                                <span className="text-white font-medium">{solicitacao.nome}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70 font-medium">Status:</span>
                                                <span className="px-3 py-1 rounded-full bg-yellow-500/30 text-yellow-100 text-sm font-semibold">
                                                    Pendente
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70 font-medium">Data/Hora:</span>
                                                <span className="text-white font-medium">{solicitacao.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={route('senhas.index')}
                                    className="w-full max-w-sm py-8 px-6 rounded-2xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-2xl hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <HomeIcon className="w-16 h-16" />
                                        <span>Voltar para o Início</span>
                                    </div>
                                </Link>

                                <p className="text-white/70 text-center text-sm mt-4 max-w-sm">
                                    Obrigado por utilizar nossos serviços! Sua solicitação é muito importante para nós.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </>
    );
}
