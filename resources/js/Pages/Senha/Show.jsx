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

                <div className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-xl ring-1 ring-white/30 shadow-2xl overflow-hidden animate-[glow_1s_ease]">
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

                    <div className="px-6 py-6 md:px-10 md:pb-8 md:pt-0">
                        <div className="text-center space-y-2 mb-6">
                            <div className="flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-white/90 p-2 ring-2 ring-white/40 shadow-xl">
                                    <img
                                        src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                        alt="Logo PREVMOC"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                                    ✓ Senha Gerada com Sucesso!
                                </h1>
                                <p className="text-sm text-white/90">
                                    {senha?.created_at}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="space-y-4">
                                <div className="rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/30 p-5 text-left space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-cyan-400/20 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Instruções</h3>
                                    </div>

                                    <div className="space-y-2 text-white/95">
                                        <div className="flex gap-2">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">1</span>
                                            <p className="text-base pt-0.5">
                                                <strong>Aguarde na sala</strong> até seu número aparecer no painel
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">2</span>
                                            <p className="text-base pt-0.5">
                                                <strong>Fique atento</strong> ao painel e ao áudio
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">3</span>
                                            <p className="text-base pt-0.5">
                                                <strong>Dirija-se ao guichê</strong> quando for chamado
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 text-white">
                                    <div className="rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25 p-4 shadow-lg text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">Serviço</p>
                                        </div>
                                        <p className="text-lg font-bold">{senha?.tipo}</p>
                                    </div>

                                    <div className="rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/25 p-4 shadow-lg text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                            <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">CPF</p>
                                        </div>
                                        <p className="text-lg font-bold font-mono">{maskCpf(senha?.cpf)}</p>
                                    </div>
                                </div>

                                <div className="text-left">
                                    <p className="text-white/80 text-sm">
                                        💡 <strong>Precisa de ajuda?</strong> Procure o balcão de informações
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div
                                    className="w-full rounded-2xl bg-gradient-to-br from-white/20 to-white/10 ring-2 ring-white/30 p-6 shadow-2xl text-center space-y-4"
                                    style={{ animation: 'popIn .35s ease-out both' }}
                                >
                                    <div className="space-y-2">
                                        <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">
                                            Atendimento para
                                        </p>
                                        <h2 className="text-2xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                                            {senha?.nome}
                                        </h2>
                                    </div>

                                    <div className="h-px bg-white/30 my-4"></div>

                                    <div className="space-y-3">
                                        <p className="text-base text-white/90 font-medium">
                                            Seu número de atendimento
                                        </p>
                                        <div className="inline-block px-6 py-4 rounded-xl bg-white/95 shadow-xl">
                                            <p className="text-6xl md:text-5xl font-black text-cyan-700 tracking-wider">
                                                {senha?.codigo}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => router.visit(route('senhas.index'))}
                                    className="w-full max-w-sm inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-cyan-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-[0.98] transition-all duration-200"
                                >
                                    <ArrowPathIcon className="h-6 w-6" />
                                    Gerar Nova Senha
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
