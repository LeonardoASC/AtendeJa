import React, { useMemo, useState, useEffect, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function VouchersIndex() {
    const VOUCHERS = [
        '6zchd5c4svrhy',
        'rzdu7iwik6jtk',
        'rtasbtxfkxhcp',
        'vjvapjfnrt67f',
        'jbncxnfems7eb',
        's5psxikpjmua7',
        '6um7yb4xcdity',
        'bvu7hp6mkc64',
        'wt5ar64f52te5',
        'q47wrztkxd7c8',
    ];

    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState(null);
    const [hidden, setHidden] = useState(true);
    const [selected, setSelected] = useState(null);
    const [modalCopied, setModalCopied] = useState(false);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return VOUCHERS;
        return VOUCHERS.filter(v => v.toLowerCase().includes(q));
    }, [search, VOUCHERS]);

    const copyVoucher = async (voucher, inModal = false) => {
        try {
            await navigator.clipboard.writeText(voucher);
            if (inModal) {
                setModalCopied(true);
                setTimeout(() => setModalCopied(false), 1500);
            } else {
                setCopied(voucher);
                setTimeout(() => setCopied(null), 1500);
            }
        } catch {
            alert('Não foi possível copiar. Selecione e copie manualmente.');
        }
    };

    const closeModal = useCallback(() => setSelected(null), []);
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        if (selected) window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selected, closeModal]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-100">Vouchers de Internet</h2>}
        >
            <Head title="Vouchers" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-10">
                <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-gray-100">
                    <section className="mb-6">
                        <div className="lg:flex lg:items-center lg:justify-between gap-4">
                            <div className="max-w-prose">
                                <p className="text-sm leading-relaxed text-gray-300">
                                    Lista de vouchers de acesso à rede. Você pode pesquisar, copiar, ocultar/mostrar e ver cada voucher separadamente.
                                </p>
                            </div>

                            <div className="mt-3 lg:mt-0 lg:shrink-0 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setHidden(h => !h)}
                                    className="inline-flex items-center justify-center rounded-lg bg-neutral-700 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                >
                                    {hidden ? 'Mostrar códigos' : 'Ocultar códigos'}
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-300 mb-1">Buscar</label>
                        <input
                            type="text"
                            placeholder="Digite parte do voucher…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((v) => {
                            const isCopied = copied === v;
                            const display = hidden ? '•'.repeat(v.length) : v;
                            return (
                                <div
                                    key={v}
                                    className="rounded-xl border border-neutral-700 bg-white/10 p-4 backdrop-blur-sm"
                                >
                                    <div className="text-xs text-gray-300 mb-1">Voucher</div>

                                    <div className="flex items-center justify-between gap-3">
                                        <code
                                            className={`font-mono text-sm break-all ${hidden ? 'tracking-widest' : ''}`}
                                            title={hidden ? 'Oculto' : v}
                                        >
                                            {display}
                                        </code>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => setSelected(v)}
                                                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                title="Ver voucher"
                                            >
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => copyVoucher(v)}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 ${isCopied
                                                    ? 'bg-emerald-600 text-white focus:ring-emerald-400'
                                                    : 'bg-neutral-700 text-white hover:bg-neutral-600 focus:ring-neutral-500'
                                                    }`}
                                                title="Copiar voucher"
                                            >
                                                {isCopied ? 'Copiado!' : 'Copiar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-6 text-xs text-gray-400">
                        Dica: para atualizar a lista, edite o array <span className="font-mono">VOUCHERS</span> no topo do arquivo.
                    </p>
                </div>
            </div>

            {selected && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                >
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-neutral-900 border border-neutral-700 p-5 text-gray-100 mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold">Voucher</h3>
                            <button
                                onClick={closeModal}
                                className="rounded-md px-2 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                aria-label="Fechar"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="rounded-lg bg-neutral-800 border border-neutral-700 p-4 text-center">
                            <code className="font-mono text-lg sm:text-xl break-all">{selected}</code>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => copyVoucher(selected, true)}
                                className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 ${modalCopied
                                    ? 'bg-emerald-600 text-white focus:ring-emerald-400'
                                    : 'bg-teal-600 text-white hover:bg-teal-500 focus:ring-teal-400'
                                    }`}
                            >
                                {modalCopied ? 'Copiado!' : 'Copiar'}
                            </button>
                            <button
                                onClick={closeModal}
                                className="inline-flex items-center justify-center rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
