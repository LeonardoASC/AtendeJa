import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export default function PerguntasFrequentes({ perguntasFrequentes = [] }) {
    const [open, setOpen] = useState(null);

    return (
        <>
            <Head title="Perguntas Frequentes" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-10 px-4">
                <img
                    src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                    alt="Logo Prevmoc"
                    className='h-24 bg-white rounded-full p-2 mb-8 object-contain'
                />

                <div className="relative w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
                    <div className="px-8 py-10">
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <QuestionMarkCircleIcon className="h-12 w-12 text-white" />
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                                    Perguntas Frequentes
                                </h1>
                            </div>
                            <p className="text-lg text-white/90">
                                Encontre respostas para as dúvidas mais comuns
                            </p>
                        </div>

                        <div className="space-y-4">
                            {perguntasFrequentes.map((pergunta, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="rounded-2xl bg-white/15 backdrop-blur overflow-hidden ring-1 ring-white/20 hover:ring-white/40 transition-all"
                                >
                                    <button
                                        onClick={() => setOpen(open === idx ? null : idx)}
                                        className="w-full flex justify-between items-center gap-4 px-6 py-5 text-left group"
                                    >
                                        <span className="text-lg font-semibold text-white group-hover:text-teal-100 transition-colors flex-1">
                                            {pergunta.pergunta}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: open === idx ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDownIcon className="h-6 w-6 text-white/70 group-hover:text-white transition-colors" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {open === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 pt-2 text-white/90 border-t border-white/10 leading-relaxed">
                                                    {pergunta.resposta}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <Link
                                href={route('senhas.index')}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/20 backdrop-blur text-white font-semibold hover:bg-white/30 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/40"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Voltar para o Início
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}