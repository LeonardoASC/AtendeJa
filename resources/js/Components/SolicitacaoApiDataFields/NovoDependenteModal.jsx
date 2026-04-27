import React from 'react';

export default function NovoDependenteModal({
    atualizarCampoNovoDependente,
    capacidadeOptions,
    errosNovoDependente,
    fecharModalNovoDependente,
    modalNovoDependenteAberto,
    novoDependenteDraft,
    podeSalvarNovoDependente,
    possuiErrosNovoDependente,
    salvarNovoDependente,
    tocarCampoNovoDependente,
    vinculoOptions,
}) {
    if (!modalNovoDependenteAberto || !novoDependenteDraft) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-100/10 p-4 backdrop-blur-3xl">
            <div className="w-full max-w-3xl rounded-3xl border border-sky-200/90 bg-white p-6 text-slate-800 shadow-[0_20px_60px_rgba(14,116,144,0.2)]">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                        Novo dependente
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-slate-900">Adicionar Dependente</h4>
                    <p className="mt-1 text-sm text-slate-600">
                        Preencha os dados abaixo para incluir um novo dependente.
                    </p>
                </div>

                {possuiErrosNovoDependente && (
                    <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                        Corrija os campos destacados para continuar.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                        <input
                            type="text"
                            required
                            value={novoDependenteDraft.NOME}
                            onChange={(event) => atualizarCampoNovoDependente('NOME', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('NOME')}
                            placeholder="NOME"
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.NOME ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        />
                        {errosNovoDependente.NOME && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.NOME}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={10}
                            value={novoDependenteDraft.DATA_NASCIMENTO}
                            onChange={(event) => atualizarCampoNovoDependente('DATA_NASCIMENTO', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('DATA_NASCIMENTO')}
                            placeholder="DATA NASCIMENTO"
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.DATA_NASCIMENTO ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        />
                        {errosNovoDependente.DATA_NASCIMENTO && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.DATA_NASCIMENTO}</p>}
                    </div>
                    <div>
                        <select
                            required
                            value={novoDependenteDraft.SEXO}
                            onChange={(event) => atualizarCampoNovoDependente('SEXO', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('SEXO')}
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.SEXO ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        >
                            <option value="">SEXO</option>
                            <option value="M">MASCULINO</option>
                            <option value="F">FEMININO</option>
                        </select>
                        {errosNovoDependente.SEXO && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.SEXO}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={14}
                            value={novoDependenteDraft.CPF}
                            onChange={(event) => atualizarCampoNovoDependente('CPF', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('CPF')}
                            placeholder="CPF (000.000.000-00)"
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.CPF ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        />
                        {errosNovoDependente.CPF && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.CPF}</p>}
                    </div>
                    <div>
                        <select
                            required
                            value={novoDependenteDraft.CAPACIDADE}
                            onChange={(event) => atualizarCampoNovoDependente('CAPACIDADE', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('CAPACIDADE')}
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.CAPACIDADE ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        >
                            <option value="">CAPACIDADE</option>
                            {capacidadeOptions.map((opcao) => (
                                <option key={opcao} value={opcao}>{opcao}</option>
                            ))}
                        </select>
                        {errosNovoDependente.CAPACIDADE && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.CAPACIDADE}</p>}
                    </div>
                    <div>
                        <select
                            required
                            value={novoDependenteDraft.VINCULO}
                            onChange={(event) => atualizarCampoNovoDependente('VINCULO', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('VINCULO')}
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.VINCULO ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        >
                            <option className="text-slate-500" value="">VINCULO</option>
                            {vinculoOptions.map((opcao) => (
                                <option key={opcao} value={opcao}>{opcao}</option>
                            ))}
                        </select>
                        {errosNovoDependente.VINCULO && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.VINCULO}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={10}
                            value={novoDependenteDraft.DATA_INICIO_DEPENDENCIA}
                            onChange={(event) => atualizarCampoNovoDependente('DATA_INICIO_DEPENDENCIA', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('DATA_INICIO_DEPENDENCIA')}
                            placeholder="DATA INICIO DEPENDENCIA"
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.DATA_INICIO_DEPENDENCIA ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        />
                        {errosNovoDependente.DATA_INICIO_DEPENDENCIA && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.DATA_INICIO_DEPENDENCIA}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            value={novoDependenteDraft.DATA_FIM_DEPENDENCIA}
                            onChange={(event) => atualizarCampoNovoDependente('DATA_FIM_DEPENDENCIA', event.target.value)}
                            onBlur={() => tocarCampoNovoDependente('DATA_FIM_DEPENDENCIA')}
                            placeholder="DATA FIM DEPENDENCIA"
                            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 ${errosNovoDependente.DATA_FIM_DEPENDENCIA ? 'border-rose-400 ring-1 ring-rose-300/70' : 'border-slate-200'}`}
                        />
                        {errosNovoDependente.DATA_FIM_DEPENDENCIA && <p className="mt-1 text-xs text-rose-600">{errosNovoDependente.DATA_FIM_DEPENDENCIA}</p>}
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={fecharModalNovoDependente}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={salvarNovoDependente}
                        disabled={!podeSalvarNovoDependente}
                        className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        Adicionar dependente
                    </button>
                </div>
            </div>
        </div>
    );
}
