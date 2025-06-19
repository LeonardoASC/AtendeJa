import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function PerguntasFrequentes({ perguntasFrequentes = [] }) {
    const [open, setOpen] = useState(null);

    return (
        <>
            <Head title="Perguntas Frequentes" />
            <div className="min-h-screen bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 flex flex-col items-center p-6 text-white">
                <h1 className="text-lg font-bold mb-8 bg-white rounded-lg py-2 px-8 text-black">Perguntas Frequentes</h1>
                <div className="w-full max-w-2xl space-y-4">
                    {perguntasFrequentes.map((pergunta, idx) => (
                        <div key={idx} className="bg-white text-gray-800 rounded-lg shadow overflow-hidden">
                            <button
                                onClick={() => setOpen(open === idx ? null : idx)}
                                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
                            >
                                <span>{pergunta.pergunta}</span>
                                <span>{open === idx ? '-' : '+'}</span>
                            </button>
                            {open === idx && (
                                <div className="px-4 pb-4 text-gray-700 border-t">
                                    {pergunta.resposta}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <Link href={route('senhas.index')} className="mt-8 underline">Voltar</Link>
            </div>
        </>
    );
}