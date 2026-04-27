import React from 'react';

export default function CampoRevisaoModal({
    campoSelecionado,
    fecharModalCampo,
    handleValorModalChange,
    isCampoComSelectNoModal,
    isCampoSexoNoModal,
    modalAberto,
    modalInputRef,
    modalTextareaRef,
    opcoesCampoSelecionadoNoModal,
    salvarModalCampo,
    setValorModal,
    usarCampoTextoSimplesNoModal,
    valorModal,
}) {
    if (!modalAberto || !campoSelecionado) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-100/10 p-4 backdrop-blur-3xl">
            <div className="w-full max-w-2xl rounded-3xl border border-sky-200/90 bg-white p-6 text-slate-800 shadow-[0_20px_60px_rgba(14,116,144,0.2)]">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                        Revisar campo
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-slate-900">{campoSelecionado.label}</h4>
                    <p className="mt-1 text-sm text-slate-600 break-all">{campoSelecionado.key}</p>
                </div>

                {isCampoSexoNoModal ? (
                    <select
                        value={valorModal}
                        onChange={(event) => setValorModal(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                    >
                        <option value="" disabled>SELECIONE</option>
                        <option value="M">MASCULINO</option>
                        <option value="F">FEMININO</option>
                    </select>
                ) : isCampoComSelectNoModal ? (
                    <select
                        value={valorModal}
                        onChange={(event) => setValorModal(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                    >
                        <option value="" disabled>SELECIONE</option>
                        {String(valorModal || '').trim() !== '' && !opcoesCampoSelecionadoNoModal.some((opcao) => opcao.value === String(valorModal)) && (
                            <option value={String(valorModal)}>{String(valorModal)}</option>
                        )}
                        {opcoesCampoSelecionadoNoModal.map((opcao) => (
                            <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                        ))}
                    </select>
                ) : usarCampoTextoSimplesNoModal ? (
                    <input
                        ref={modalInputRef}
                        type="text"
                        value={valorModal}
                        onChange={(event) => handleValorModalChange(campoSelecionado.key, event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                    />
                ) : (
                    <textarea
                        ref={modalTextareaRef}
                        value={valorModal}
                        onChange={(event) => handleValorModalChange(campoSelecionado.key, event.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                    />
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={fecharModalCampo}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={salvarModalCampo}
                        className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-500"
                    >
                        Aplicar revisao
                    </button>
                </div>
            </div>
        </div>
    );
}
