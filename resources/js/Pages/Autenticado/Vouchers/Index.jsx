import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ vouchers = [] }) {
    const [hidden, setHidden] = useState(true);
    const [selected, setSelected] = useState(null);
    const [usingId, setUsingId] = useState(null);
    const fileRef = useRef(null);
    const [importing, setImporting] = useState(false);

    const confirmUse = async () => {
        if (!selected?.id) return;
        try {
            setUsingId(selected.id);
            router.post(route('vouchers.use', selected.id), {}, {
                preserveScroll: true,
                onFinish: () => {
                    setUsingId(null);
                    setSelected(null);
                },
                onError: () => {
                    setUsingId(null);
                    alert('Não foi possível usar este voucher.');
                },
            });
        } catch {
            setUsingId(null);
            alert('Não foi possível usar este voucher.');
        }
    };

    const onImportClick = () => fileRef.current?.click();

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        router.post(route('vouchers.import'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alert('Vouchers importados com sucesso!');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Falha ao importar. Verifique o CSV (uma coluna) e tente novamente.');
            },
            onFinish: () => {
                setImporting(false);
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    };

    const closeModal = useCallback(() => setSelected(null), []);
    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === 'Escape') closeModal(); };
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
                                    Clique em <strong>Usar</strong> para visualizar o código e confirme em <strong>OK</strong> para marcar como utilizado.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Para atualizar a lista por CSV: selecione um arquivo <code>.csv</code> com <em>uma coluna</em> contendo os códigos (linha por linha).
                                    A importação apaga todos os vouchers antigos e adiciona apenas os novos.
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

                                <button
                                    type="button"
                                    onClick={onImportClick}
                                    disabled={importing}
                                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
                                    title="Importar um CSV (uma coluna)"
                                >
                                    {importing ? 'Importando…' : 'Importar CSV'}
                                </button>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,text/csv"
                                    className="hidden"
                                    onChange={onFileChange}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {vouchers.data?.map((v) => {
                            const code = v.code ?? '';
                            const display = hidden ? '•'.repeat(code.length) : code;

                            return (
                                <div key={v.id ?? code} className="rounded-xl border border-neutral-700 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="text-xs text-gray-300 mb-1">Voucher</div>

                                    <div className="flex items-center justify-between gap-3">
                                        <code
                                            className={`font-mono text-sm break-all ${hidden ? 'tracking-widest' : ''}`}
                                            title={hidden ? 'Oculto' : code}
                                        >
                                            {display}
                                        </code>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => setSelected({ id: v.id, code })}
                                                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                                title="Usar voucher"
                                            >
                                                Usar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {vouchers.length === 0 && (
                            <div className="col-span-full rounded-xl border border-neutral-700 bg-white/10 p-8 text-center">
                                <p className="text-sm text-gray-300">Nenhum voucher disponível.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selected && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-neutral-900 border border-neutral-700 p-5 text-gray-100 mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-semibold">Confirmar uso do voucher</h3>
                            <button
                                onClick={closeModal}
                                className="rounded-md px-2 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                aria-label="Fechar"
                            >
                                Fechar
                            </button>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">
                            Ao confirmar, este voucher será marcado como utilizado e não aparecerá mais na lista.
                        </p>

                        <div className="rounded-lg bg-neutral-800 border border-neutral-700 p-4 text-center">
                            <code className="font-mono text-lg sm:text-xl break-all">{selected.code}</code>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <button
                                disabled={usingId === selected.id}
                                onClick={confirmUse}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {usingId === selected.id ? 'Confirmando…' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
