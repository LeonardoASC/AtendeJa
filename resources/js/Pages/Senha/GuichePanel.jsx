import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    PlayIcon,
    CheckCircleIcon,
    ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/solid';

export default function GuichePanel({ guiche, initialSenha = null, queue = [], attended = [] }) {
    const [current, setCurrent] = useState(initialSenha);
    const [loading, setLoading] = useState(false);
    const [elapsed, setElapsed] = useState('00:00');

    useEffect(() => {
        if (!current) return;
        const start = new Date(current.started_at || Date.now());
        const tick = () => {
            const diff = Date.now() - start.getTime();
            const m = String(Math.floor(diff / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            setElapsed(`${m}:${s}`);
        };
        tick();
        const int = setInterval(tick, 1000);
        return () => clearInterval(int);
    }, [current]);

    const chamar = () => {
        setLoading(true);
        router.post(
            route('senhas.chamar'),
            { guiche },
            {
                onSuccess: (page) => setCurrent(page.props.senha),
                onFinish: () => setLoading(false),
            },
        );
    };

    const finalizar = () => {
        if (!current) return;
        setLoading(true);
        router.post(
            route('senhas.finalizar', current.id),
            {},
            {
                onSuccess: () => setCurrent(null),
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <>
            <Head title={`Guichê ${guiche}`} />

            <div className="min-h-screen flex flex-col bg-gray-100 font-[Inter,sans-serif]">
                <header className="bg-[#004B6E] text-white flex items-center justify-between px-6 py-3 shadow-md">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-wide flex items-center gap-3">
                        <ArrowPathRoundedSquareIcon className="w-8 h-8" /> Guichê {guiche}
                    </h1>
                    <span className="text-sm md:text-base bg-white/10 rounded-full px-3 py-1">
                        Aguardando: {queue.length}
                    </span>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
                    {current ? (
                        <>
                            <div className="flex flex-col items-center gap-4">
                                <p className="uppercase tracking-widest text-lg text-gray-500">Senha em atendimento</p>
                                <span className="text-7xl md:text-9xl font-extrabold text-gray-800 drop-shadow">
                                    {current.codigo}
                                </span>
                                <p className="text-gray-600 mt-2">Tempo: {elapsed}</p>
                            </div>

                            <div className="flex gap-6 flex-wrap justify-center">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-3 transition disabled:opacity-60"
                                    onClick={finalizar}
                                    disabled={loading}
                                >
                                    <CheckCircleIcon className="w-6 h-6" /> Finalizar atendimento
                                </button>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-3 transition disabled:opacity-60"
                                    onClick={chamar}
                                    disabled={loading}
                                >
                                    <PlayIcon className="w-6 h-6" /> Próxima senha
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-3xl px-12 py-6 rounded-2xl flex items-center gap-4 transition disabled:opacity-60"
                            onClick={chamar}
                            disabled={loading}
                        >
                            <PlayIcon className="w-10 h-10" /> Chamar próxima senha
                        </button>
                    )}
                </main>

                <footer className="bg-white shadow-inner px-6 py-6 flex flex-col lg:flex-row gap-8 lg:gap-4 justify-between">
                    <div className="flex-1 min-w-[220px]">
                        <h2 className="text-lg font-medium mb-2">Próximas senhas</h2>
                        <ul className="flex flex-wrap gap-2 text-gray-800 font-semibold text-base">
                            {queue.map((c, i) => (
                                <li key={i} className="bg-gray-200 rounded-lg px-3 py-1">
                                    {c}
                                </li>
                            ))}
                            {queue.length === 0 && <li className="text-gray-500">Nenhuma</li>}
                        </ul>
                    </div>

                    <div className="flex-1 min-w-[220px]">
                        <h2 className="text-lg font-medium mb-2">Últimas finalizadas</h2>
                        <ul className="flex flex-wrap gap-2 text-gray-700 font-semibold text-base">
                            {attended.map((c, i) => (
                                <li key={i} className="bg-gray-200 rounded-lg px-3 py-1">
                                    {c}
                                </li>
                            ))}
                            {attended.length === 0 && <li className="text-gray-500">Nenhuma</li>}
                        </ul>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 self-end lg:self-auto">
                        Atalho:&nbsp;
                        <kbd className="font-mono bg-gray-200 px-1">Enter</kbd>&nbsp;= Próxima ·{' '}
                        <kbd className="font-mono bg-gray-200 px-1">Esc</kbd>&nbsp;= Finalizar
                    </div>
                </footer>
            </div>
        </>
    );
}
