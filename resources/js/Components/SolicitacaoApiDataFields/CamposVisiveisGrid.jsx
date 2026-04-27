import React from 'react';

export default function CamposVisiveisGrid({
    passo,
    abrirModalCampo,
    getValorExibicaoCampo,
    isCampoAlterado,
    valorCampoAtual,
}) {
    if (passo.camposVisiveis.length === 0) return null;

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {passo.camposVisiveis.map((campo) => (
                <div key={campo.key}>
                    <label className="text-xs font-semibold uppercase tracking-wide text-white/70">
                        {campo.label}
                    </label>
                    <input
                        type="text"
                        readOnly
                        onClick={() => abrirModalCampo(campo)}
                        value={getValorExibicaoCampo(campo, valorCampoAtual(campo))}
                        className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-base text-white focus:outline-none ${isCampoAlterado(campo)
                            ? 'border-amber-300 bg-amber-300/15 ring-1 ring-amber-200/70'
                            : 'border-white/20 bg-white/10'
                            }`}
                    />
                    {isCampoAlterado(campo) && (
                        <p className="mt-1 text-xs font-semibold text-amber-100">
                            Campo alterado para recadastramento
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
