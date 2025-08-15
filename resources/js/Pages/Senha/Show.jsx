import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function Show({ senha }) {
    const [step] = useState(3);
    const steps = ['Início', 'Serviço', 'CPF', 'Concluído'];
    const maskCpf = cpf => (cpf?.toString().replace(/\D/g, '').replace(/^(\d{3})\d{6}(\d{2})$/, '$1.***.***-$2')) || '***';

    return (
        <>
            <Head title="Senha Gerada" />


            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-cyan-700 to-teal-600 p-6">
                <div className="pointer-events-none fixed inset-0 opacity-30">
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400 blur-3xl" />
                    <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-teal-400 blur-3xl" />
                </div>

                <div className="relative w-full max-w-3xl rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/30 shadow-2xl overflow-hidden animate-[glow_1s_ease]">
                    <div className="relative p-6">
                        <div className="absolute left-8 right-8 top-1/2 -z-10 h-1 mt-10 bg-white/25 rounded-full" />
                        <div
                            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 mt-10 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500"
                            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                        />
                        <div className="flex justify-between">
                            {steps.map((s, i) => (
                                <div key={s} className="flex flex-col items-center gap-2">
                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${i <= step
                                            ? 'border-white bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg'
                                            : 'border-white/40 bg-white/20 text-white/60'
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className={`text-xs md:text-sm ${i <= step ? 'text-white' : 'text-white/60'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 py-10 md:p-12 text-center space-y-8">
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-14 w-14 rounded-full bg-white/90 p-2 ring-2 ring-white/40 shadow">
                                <img
                                    src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                    alt="Logo PREVMOC"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-white/95 leading-tight">Senha gerada</h2>
                                <p className="text-xs text-white/75">{senha?.created_at}</p>
                            </div>
                        </div>

                        <div
                            className="mx-auto max-w-3xl rounded-2xl bg-white/10 ring-1 ring-white/20 p-6 md:p-8 shadow-xl"
                            style={{ animation: 'popIn .35s ease-out both' }}
                        >
                            <p className="text-[11px] uppercase tracking-widest text-white/70 mb-3">Atendimento para</p>
                            <h1
                                className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-sm leading-tight tracking-wider"
                            >
                                {senha?.nome}
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                            <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-5 shadow">
                                <p className="text-xs uppercase tracking-widest text-white/70 mb-1">Código</p>
                                <p className="text-3xl font-black tracking-widest">{senha?.codigo}</p>
                            </div>

                            <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-5 shadow">
                                <p className="text-xs uppercase tracking-widest text-white/70 mb-1">Serviço</p>
                                <p className="text-base font-semibold">{senha?.tipo}</p>
                            </div>

                            <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-5 shadow">
                                <p className="text-xs uppercase tracking-widest text-white/70 mb-1">CPF</p>
                                <p className="text-base font-semibold">{maskCpf(senha?.cpf)}</p>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.visit(route('senhas.index'))}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-cyan-700 font-semibold shadow-lg hover:shadow-xl active:scale-[0.99] transition"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                                Nova senha
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
