import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Telao({ senhasAtendidas = [] }) {
    const lastCalled = senhasAtendidas[0] ?? null;
    const recent = senhasAtendidas.slice(0, 6);
    const [now, setNow] = useState(new Date());

    const previousId = useRef(null);
    const beepRef = useRef(null);

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1_000);
        return () => clearInterval(t);
    }, []);

    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel('senhas.telao')
                .listen('.SenhaAtualizada', () => {
                    router.reload({ only: ['senhasAtendidas'] });
                });

            return () => window.Echo.leave('senhas.telao');
        }
    }, []);

    useEffect(() => {
        if (lastCalled && lastCalled.id !== previousId.current) {
            previousId.current = lastCalled.id;
            beepRef.current?.play().catch(() => {
                console.warn('Não foi possível reproduzir o som de alerta.');
            });
        }
    }, [lastCalled]);

    return (
        <>
            <Head title="Telão de Senhas" />
            <audio ref={beepRef} src="/sounds/beep.mp3" preload="auto" />
            <div className="w-full h-screen flex flex-col bg-[#004B6E] text-white overflow-hidden font-[\'Inter\',sans-serif]">

                <header className="w-full bg-white h-16 flex items-center justify-center px-4">
                    <img src="/images/logoPrevmocHorizontal.png" alt="Painel" className="h-10" />
                </header>
                <main className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden">

                    <section className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
                        {lastCalled ? (
                            <>
                                <h2 className="text-2xl md:text-3xl tracking-wider font-medium mb-4">Senha</h2>
                                <span className="text-7xl text-center font-extrabold leading-none drop-shadow-lg uppercase">
                                    {lastCalled.nome}
                                </span>
                                <span className="text-3xl font-semibold text-slate-200 leading-none drop-shadow-lg">
                                    {lastCalled.codigo}
                                </span>
                                <h3 className="text-2xl md:text-3xl tracking-wider font-medium mt-6">Guichê</h3>
                                <span className="text-6xl md:text-7xl font-bold leading-none">
                                    {lastCalled?.guiche?.nome ?? '—'}
                                </span>
                            </>
                        ) : (
                            <p className="text-3xl font-semibold">Aguardando chamadas…</p>
                        )}
                    </section>

                    <aside className="w-full lg:w-96 xl:w-[28rem] bg-white/10 backdrop-blur-sm p-4 flex flex-col gap-4">
                        <div className="w-full rounded-lg overflow-hidden aspect-video bg-black/70">
                            <iframe
                                src="https://www.youtube.com/embed/llQXGJ4AkYw"
                                title="YouTube video"
                                allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                className="w-full h-full border-0"
                            />
                        </div>

                        <h4 className="text-center text-xl font-semibold uppercase">últimas chamadas</h4>

                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-lg md:text-xl">
                                <thead className="sticky top-0 bg-white/10 backdrop-blur-sm">
                                    <tr>
                                        <th className="py-2 px-2 text-left">Senha</th>
                                        <th className="py-2 px-2 text-left">Guichê</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.map((s) => (
                                        <tr key={s.id} className="odd:bg-white/5 hover:bg-white/15 transition-colors">
                                            <td className="py-2 px-2 font-medium tracking-wide">{s.codigo}</td>
                                            <td className="py-2 px-2">{s?.guiche?.nome ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </aside>
                </main>

                <footer className="h-14 bg-black/40 backdrop-blur flex items-center justify-between px-6 text-sm md:text-base">
                    <div className="flex items-center gap-4">
                        <span className="i-ph-calendar-blank-bold text-lg md:text-xl" />
                        <time dateTime={dateStr}>{dateStr}</time>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="i-ph-clock-bold text-lg md:text-xl" />
                        <time dateTime={timeStr}>{timeStr}</time>
                    </div>
                </footer>
            </div>
        </>
    );
}
