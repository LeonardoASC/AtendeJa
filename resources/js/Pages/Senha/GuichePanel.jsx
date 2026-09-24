import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    PlayIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/solid';
import {
    ArrowLeftCircleIcon,
    ChatBubbleLeftRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function GuichePanel({
    guiche,
    initialSenha = null,
    queue = [],
    attended = [],
    comentariosCidadao = [],
}) {
    const [current, setCurrent] = useState(initialSenha);
    const [comentarios, setComentarios] = useState(comentariosCidadao);
    const [minimizado, setMinimizado] = useState(true);
    const [loading, setLoading] = useState(false);
    const [elapsed, setElapsed] = useState('00:00');
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const emAtendimento = Boolean(current);

    useEffect(() => {
        if (!current) return;
        const start = current.inicio_atendimento
            ? new Date(current.inicio_atendimento)
            : new Date();
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
        setComentarios(comentariosCidadao);
    }, [comentariosCidadao]);

    useEffect(() => {
        if (!window.Echo) {
            console.error('Laravel Echo not found. Make sure it is initialized.');
            return;
        }

        const chNovas = window.Echo.channel('senhas.novas')
            .listen('.SenhaCriada', () => {
                router.reload({ only: ['queue'] });
            });

        const chTelao = window.Echo.channel('senhas.telao')
            .listen('.SenhaAtualizada', (e) => {
                router.reload({ only: ['initialSenha', 'queue', 'attended', 'comentariosCidadao'] });
            });

        return () => {
            window.Echo.leave('senhas.novas');
            window.Echo.leave('senhas.telao');
        };
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
                    <Link href={route('dashboard')} className="flex items-center gap-2 text-white hover:text-gray-300">
                        <ArrowLeftCircleIcon className="w-8 h-8" />
                        <span className="text-lg font-semibold">Guichê {guiche}</span>
                    </Link>
                    <span className="text-sm md:text-base bg-white/10 rounded-full px-3 py-1">
                        Aguardando: {queue.length}
                    </span>
                </header>

                <main className={`flex-1 grid grid-cols-1 ${minimizado
                        ? 'lg:grid-cols-[68px_1fr_290px] xl:grid-cols-[72px_1fr_300px]'
                        : 'lg:grid-cols-[290px_1fr_290px] xl:grid-cols-[320px_1fr_300px]'
                    } gap-3 md:gap-4 p-3 md:p-4 w-full mx-auto transition-all duration-300`}>
                    {minimizado ? (
                        <aside className="order-2 lg:order-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-row lg:flex-col items-center p-2.5 lg:py-3  gap-2.5 transition-all duration-300 lg:max-h-[calc(100vh-7rem)] select-none">
                            <button
                                type="button"
                                onClick={() => setMinimizado(false)}
                                title="Expandir comentários"
                                className="p-1.5 text-slate-500 hover:text-[#004B6E] hover:bg-slate-100 rounded-lg transition shrink-0"
                            >
                                <ChevronRightIcon className="w-5 h-5 hidden lg:block" />
                                <ChevronLeftIcon className="w-5 h-5 block lg:hidden rotate-90" />
                            </button>

                            <span
                                className="text-xs font-bold bg-[#004B6E] text-white rounded-full min-w-[1.75rem] h-7 px-2 flex items-center justify-center shadow-xs shrink-0 cursor-pointer"
                                onClick={() => setMinimizado(false)}
                                title={`${comentarios.length} comentário(s) anterior(es) - clique para expandir`}
                            >
                                {comentarios.length}
                            </span>

                            <div className="hidden lg:block w-8 border-t border-slate-200 my-0.5" />

                            <div className="flex-1 flex flex-row lg:flex-col items-center gap-2 overflow-x-auto lg:overflow-y-auto max-w-full lg:w-full py-1 px-1">
                                {comentarios.map((coment, idx) => {
                                    const cor = coment.avaliacao_cor || '#0D9488';
                                    const tooltip = [
                                        coment.codigo,
                                        coment.avaliacao_tag,
                                        coment.comentario ? `"${coment.comentario}"` : null,
                                    ]
                                        .filter(Boolean)
                                        .join(' - ');

                                    return (
                                        <button
                                            key={coment.id || idx}
                                            type="button"
                                            onClick={() => setMinimizado(false)}
                                            className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-300 shadow-xs cursor-pointer hover:scale-125 transition-transform shrink-0"
                                            style={{ backgroundColor: cor }}
                                            title={tooltip || 'Avaliação anterior'}
                                        />
                                    );
                                })}

                                {comentarios.length === 0 && (
                                    <span className="text-[11px] text-slate-400 text-center">
                                        -
                                    </span>
                                )}
                            </div>
                        </aside>
                    ) : (
                        <aside className="order-2 lg:order-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 lg:max-h-[calc(100vh-7rem)]">
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#004B6E]" />
                                    <h2 className="text-sm font-semibold text-slate-800">Comentários anteriores</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-[#004B6E] text-white rounded-full min-w-[1.5rem] text-center px-2 py-0.5">
                                        {comentarios.length}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setMinimizado(true)}
                                        title="Minimizar comentários"
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                                {comentarios.map((coment) => (
                                    <div
                                        key={coment.id}
                                        className="rounded-lg border bg-slate-50/70 p-2.5 text-xs space-y-1.5 transition hover:bg-slate-50"
                                        style={{
                                            borderLeftWidth: '4px',
                                            borderLeftColor: coment.avaliacao_cor || '#0D9488',
                                        }}
                                    >
                                        <div className="flex items-center justify-between gap-1.5">
                                            <span className="font-bold text-[#004B6E] tabular-nums">
                                                {coment.codigo}
                                            </span>
                                            <span className="text-[10px] text-slate-400 tabular-nums">
                                                {coment.avaliado_em
                                                    ? new Date(coment.avaliado_em).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                    : coment.created_at
                                                        ? new Date(coment.created_at).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                        : ''}
                                            </span>
                                        </div>

                                        {coment.avaliacao_tag && (
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-xs"
                                                    style={{ backgroundColor: coment.avaliacao_cor || '#0D9488' }}
                                                >
                                                    {coment.avaliacao_tag}
                                                </span>
                                                {coment.tipo_atendimento?.nome && (
                                                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                                                        {coment.tipo_atendimento.nome}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {coment.comentario && (
                                            <p className="text-slate-700 leading-relaxed text-[11px] bg-white rounded p-2 border border-slate-100 shadow-2xs whitespace-pre-wrap break-words">
                                                {coment.comentario}
                                            </p>
                                        )}

                                        <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                                            <span className="truncate">
                                                Por: <strong className="text-slate-600">{coment.avaliacao_atendente_nome || coment.atendente_nome || 'Atendente'}</strong>
                                            </span>
                                            {coment.guiche?.nome && (
                                                <span>Guichê {coment.guiche.nome}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {comentarios.length === 0 && (
                                    <div className="text-center py-8 px-3 text-xs text-slate-400">
                                        {current ? (
                                            <>
                                                <p className="font-medium text-slate-500">Nenhum comentário anterior</p>
                                                <p className="text-[11px] mt-1 text-slate-400">
                                                    Não há outros comentários registrados para este CPF.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium text-slate-500">Guichê livre</p>
                                                <p className="text-[11px] mt-1 text-slate-400">
                                                    Ao chamar uma senha, o histórico de comentários do cidadão aparecerá aqui.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </aside>
                    )}

                    <section className="order-1 lg:order-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        {current ? (
                            <>
                                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                                    <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
                                        Senha em atendimento
                                    </p>
                                    <span
                                        className={`text-xs font-mono font-semibold border rounded-full px-2.5 py-0.5 ${parseInt(elapsed, 10) >= 20
                                                ? 'bg-red-50 text-red-700 border-red-200'
                                                : parseInt(elapsed, 10) >= 10
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}
                                        title="Tempo de atendimento"
                                    >
                                        ⏱ {elapsed}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-5">
                                    <span className="text-5xl md:text-7xl leading-none font-black tracking-tight text-[#004B6E]">
                                        {current.codigo}
                                    </span>

                                    <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {[
                                            { label: 'Nome', value: current.nome, full: true },
                                            { label: 'E-mail', value: current.email },
                                            { label: 'CPF', value: current.cpf },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className={`rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 min-w-0 ${item.full ? 'md:col-span-2' : ''
                                                    }`}
                                            >
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                                    {item.label}
                                                </p>
                                                <p
                                                    className={`text-sm truncate ${item.value ? 'text-slate-800 font-semibold' : 'text-slate-400 italic'
                                                        }`}
                                                >
                                                    {item.value || 'Não informado'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {current.historico_cor && (
                                        <div
                                            className="w-full max-w-xl flex items-start gap-2.5 rounded-lg border bg-white px-3 py-2"
                                            style={{
                                                borderColor: current.historico_cor,
                                                boxShadow: `inset 3px 0 0 ${current.historico_cor}`,
                                            }}
                                        >
                                            <span
                                                className="w-2.5 h-2.5 mt-1 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: current.historico_cor }}
                                            />
                                            <div className="text-xs">
                                                <p className="text-slate-500">
                                                    Histórico deste CPF:{' '}
                                                    <strong className="text-slate-800">
                                                        {current.historico_tag || 'Comentário registrado'}
                                                    </strong>
                                                </p>
                                                {current.historico_comentario && (
                                                    <p className="text-slate-600 mt-0.5">{current.historico_comentario}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-2 px-4 py-3 bg-slate-50 border-t border-slate-100">
                                    <button
                                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-[.99] text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={finalizar}
                                        disabled={loading}
                                    >
                                        <CheckCircleIcon className="w-5 h-5" /> Finalizar atendimento
                                    </button>
                                    <button
                                        className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        onClick={cancelar}
                                        disabled={loading}
                                    >
                                        <XCircleIcon className="w-4 h-4" /> Cancelar atendimento
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-[#004B6E]/10 flex items-center justify-center">
                                    <PlayIcon className="w-6 h-6 text-[#004B6E]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Guichê livre</h2>
                                    <p className="text-sm text-slate-500">
                                        {queue.length > 0
                                            ? `${queue.length} ${queue.length === 1 ? 'pessoa aguardando' : 'pessoas aguardando'}`
                                            : 'Nenhuma senha na fila no momento'}
                                    </p>
                                </div>

                                {queue[0] && (
                                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                            Próxima
                                        </span>
                                        <span className="font-bold text-[#004B6E]">{queue[0].codigo}</span>
                                        <span className="text-slate-600 truncate max-w-[180px]">
                                            {queue[0].nome || 'Não informado'}
                                        </span>
                                    </div>
                                )}

                                <button
                                    className="bg-[#004B6E] hover:bg-[#003a56] active:scale-[.99] text-white font-semibold text-base md:text-lg px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-md shadow-[#004B6E]/20 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
                                    onClick={chamar}
                                    disabled={loading || queue.length === 0}
                                >
                                    <PlayIcon className="w-5 h-5" /> Chamar próxima senha
                                </button>
                            </div>
                        )}
                    </section>

                    <aside className="order-3 lg:order-3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden lg:max-h-[calc(100vh-7rem)]">
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                            <h2 className="text-sm font-semibold text-slate-800">Próximas senhas</h2>
                            <span className="text-xs font-bold bg-[#004B6E] text-white rounded-full min-w-[1.5rem] text-center px-2 py-0.5">
                                {queue.length}
                            </span>
                        </div>

                        <ul className="flex-1 overflow-y-auto p-2 space-y-1">
                            {queue.map((q, idx) => (
                                <li key={q.id}>
                                    <button
                                        className={`group w-full text-left flex items-center gap-2 rounded-lg px-2.5 py-1.5 border text-sm transition ${idx === 0
                                                ? 'bg-[#004B6E]/5 border-[#004B6E]/20 hover:bg-[#004B6E]/10'
                                                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                            }`}
                                        onClick={() => {
                                            setSelectedId(q.id);
                                            setShowModal(true);
                                        }}
                                        title={
                                            q.historico_cor
                                                ? `Avaliação/Comentário anterior: ${q.historico_tag || 'Comentário registrado'}${q.historico_comentario ? ` - ${q.historico_comentario}` : ''
                                                }`
                                                : 'Chamar fora da ordem'
                                        }
                                    >
                                        <span className="w-5 text-[10px] font-semibold text-slate-400 text-right tabular-nums">
                                            {idx + 1}º
                                        </span>
                                        <span className="font-bold text-[#004B6E] tabular-nums">{q.codigo}</span>
                                        <span className="flex-1 min-w-0 truncate text-xs text-slate-600">
                                            {q.nome || <span className="italic text-slate-400">Não informado</span>}
                                        </span>
                                        {q.historico_cor && (
                                            <span
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white shadow"
                                                style={{ backgroundColor: q.historico_cor }}
                                            />
                                        )}
                                        <PlayIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#004B6E] transition flex-shrink-0" />
                                    </button>
                                </li>
                            ))}

                            {queue.length === 0 && (
                                <li className="text-center py-8 text-xs text-slate-400">
                                    Aguardando senha para atendimento
                                </li>
                            )}
                        </ul>
                    </aside>
                </main>


                <footer className="bg-white shadow-inner px-4  md:px-6 md:py-3 flex flex-col lg:flex-row gap-8 lg:gap-4 justify-between">
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
