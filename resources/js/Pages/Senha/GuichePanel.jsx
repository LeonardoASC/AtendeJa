import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    PlayIcon,
    CheckCircleIcon,
    ArrowPathRoundedSquareIcon,
    XCircleIcon,
} from '@heroicons/react/24/solid';

export default function GuichePanel({ guiche, initialSenha = null, queue = [], attended = [] }) {
    const [current, setCurrent] = useState(initialSenha);
    const [loading, setLoading] = useState(false);
    const [elapsed, setElapsed] = useState('00:00');
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const emAtendimento = Boolean(current);

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

    useEffect(() => {
        setCurrent(initialSenha);
    }, [initialSenha]);

    useEffect(() => {
        if (window.Echo) {
            console.log('Subscribing to senhas.novas channel...');
            const channel = window.Echo.channel('senhas.novas');

            channel.listen('.SenhaCriada', (event) => {
                console.log('SenhaCriada event received:', event);
                router.reload();
            });

            return () => {
                console.log('Leaving senhas.novas channel...');
                window.Echo.leave('senhas.novas');
            };
        } else {
            console.error('Laravel Echo not found. Make sure it is initialized.');
        }
    }, []);

    const chamar = () => {
        setLoading(true);
        router.post(
            route('senhas.chamar'),
            { guiche },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const finalizar = () => {
        if (!current) return;
        setLoading(true);

        router.post(
            route('senhas.finalizar', current.id),
            { guiche },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const cancelar = () => {
        if (!current) return;
        setLoading(true);

        router.post(
            route('senhas.cancelar', current.id),
            { guiche },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const chamarSenha = (id) => {
        setLoading(true);
        router.post(
            route('senhas.chamarSenha', id),
            { guiche },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <>
            <Head title={`Guichê ${guiche}`} />

            <div className="min-h-screen flex flex-col bg-gray-100 font-[Inter,sans-serif]">
                <header className="bg-[#004B6E] text-white flex items-center justify-between px-6 py-3 shadow-md md:px-6 md:py-3">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-wide flex items-center gap-3">
                        <ArrowPathRoundedSquareIcon className="w-8 h-8" /> Guichê {guiche}
                    </h1>
                    <span className="text-sm md:text-base bg-white/10 rounded-full px-3 py-1">
                        Aguardando: {queue.length}
                    </span>
                </header>

                <main className="flex flex-1 flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-6">
                    <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-2xl shadow p-6">
                        {current ? (
                            <>
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <p className="uppercase tracking-widest text-lg text-gray-500">
                                        Senha em atendimento
                                    </p>
                                    <span className="text-7xl md:text-9xl font-extrabold text-gray-800 drop-shadow">
                                        {current.codigo}
                                    </span>
                                    <div className='text-center font-semibold text-gray-700'>
                                        <p className="text-gray-600 mt-2">Nome: {current.nome ? current.nome : 'Não informado'}</p>
                                        <p className="text-gray-600">Email: {current.email ? current.email : 'Não informado'}</p>
                                        <p className="text-gray-600">CPF: {current.cpf ? current.cpf : 'Não informado'}</p>
                                    </div>
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
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-3 transition disabled:opacity-60"
                                        onClick={cancelar}
                                        disabled={loading}
                                    >
                                        <XCircleIcon className="w-6 h-6" /> Cancelar Atendimento
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-3xl px-12 py-6 rounded-2xl flex items-center gap-4 transition disabled:opacity-60"
                                onClick={chamar}
                                disabled={loading || queue.length === 0}
                            >
                                <PlayIcon className="w-10 h-10" /> Chamar próxima senha
                            </button>
                        )}
                    </div>

                    <div className="w-full md:w-[320px] bg-white rounded-2xl shadow p-6 flex flex-col">
                        <h2 className="text-lg font-medium mb-4">Próximas senhas</h2>
                        <ul className="flex flex-col gap-2 text-gray-800 font-semibold text-base overflow-y-auto">
                            {queue.map((q) => (
                                <li key={q.id}>
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 rounded-lg px-3 py-2 w-full text-left"
                                        onClick={() => {
                                            setSelectedId(q.id);
                                            setShowModal(true);
                                        }}
                                    >
                                        {q.codigo} - {q.nome}
                                    </button>
                                </li>
                            ))}
                            {queue.length === 0 && <li className="text-gray-500 text-xs">Aguardando Senha para Atendimento</li>}
                        </ul>
                    </div>
                </main>

                <footer className="bg-white shadow-inner px-4  md:px-6 md:py-6 py-6 flex flex-col lg:flex-row gap-8 lg:gap-4 justify-between">
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
                </footer>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Confirmar ação</h2>

                        {emAtendimento ? (
                            <p className="text-sm text-red-600">
                                Você está em atendimento. Finalize ou cancele o atendimento atual para chamar outra senha.
                            </p>
                        ) : (
                            <p className="text-gray-600">
                                Você está prestes a chamar uma senha fora da ordem. Deseja continuar?
                            </p>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg"
                                onClick={() => { setShowModal(false); setSelectedId(null); }}
                            >
                                Cancelar
                            </button>

                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-60"
                                disabled={emAtendimento || !selectedId}
                                onClick={() => {
                                    if (emAtendimento) return;
                                    if (!selectedId) return;
                                    chamarSenha(selectedId);
                                    setShowModal(false);
                                    setSelectedId(null);
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
