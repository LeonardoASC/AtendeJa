import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ senha }) {
    const [step, setStep] = useState(4);
    const steps = ['Início', 'Serviço', 'CPF', 'Concluído'];
    return (
        <>
            <Head title="Senha Gerada" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-10 px-4">
                <div className="relative w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
                    <div className="relative p-6">
                        <div className="absolute left-8 right-8 top-1/2 -z-10 h-1 mt-10 bg-white/30 rounded-full" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1 mt-10 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500"
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
                                    <span className={`text-xs md:text-sm ${i <= step ? 'text-white' : 'text-white/60'}`}>
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-8 md:p-12 text-center ">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-extrabold text-emerald-300">
                                Senha Gerada!
                            </h2>

                            <div className="space-y-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-inner text-white">
                                <p className="text-lg"><span className="font-semibold">Serviço: </span>{senha.tipo}</p>
                                <p className="text-lg"><span className="font-semibold">CPF:</span> {senha.cpf}</p>
                                <p className="text-4xl font-black tracking-widest">{senha.codigo}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.visit(route('senhas.index'))}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 font-semibold text-white text-xl hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                            >
                                Gerar nova senha
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
