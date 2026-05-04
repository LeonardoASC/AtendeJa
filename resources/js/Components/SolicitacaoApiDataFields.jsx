import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    capacidadeCodigoOptions,
    estadoCivilOptions,
    templateDependente,
    vinculoCodigoOptions,
    racaCorOptions,
} from '../Pages/Solicitacao/Utils/fieldData';
import {
    formatarCpf,
    formatarTelefone,
    labelFromKey,
    obterUltimaChaveNormalizada,
} from '../Pages/Solicitacao/Utils/fieldHelpers';
import { getSelectOptionsByCampo, getValorExibicaoCampo } from '../Pages/Solicitacao/Utils/fieldSelectHelpers';
import { validarCampoNovoDependente, validarNovoDependente } from '../Pages/Solicitacao/Utils/fieldValidationHelpers';
import {
    isSecaoDependente,
    isSecaoDependenteIndividual,
    isSecaoResponsavelLegal,
} from '../Pages/Solicitacao/Utils/fieldSectionHelpers';
import {
    montarCamposApiPorSecao,
    montarPassos,
    montarValoresOriginaisPorChave,
    normalizarValorDependente,
} from '../Pages/Solicitacao/Utils/solicitacaoApiFieldsUtils';
import CamposVisiveisGrid from './SolicitacaoApiDataFields/CamposVisiveisGrid';
import CampoRevisaoModal from './SolicitacaoApiDataFields/CampoRevisaoModal';
import NovoDependenteModal from './SolicitacaoApiDataFields/NovoDependenteModal';

export default function SolicitacaoApiDataFields({ dadosFormulario = {}, onReviewDataChange }) {
    const [mostrarCamposOcultos, setMostrarCamposOcultos] = useState(false);
    const [passoAtual, setPassoAtual] = useState(0);
    const [camposEditados, setCamposEditados] = useState({});
    const [dependentesParaRemover, setDependentesParaRemover] = useState({});
    const [novosDependentes, setNovosDependentes] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [campoSelecionado, setCampoSelecionado] = useState(null);
    const [valorModal, setValorModal] = useState('');
    const [modalNovoDependenteAberto, setModalNovoDependenteAberto] = useState(false);
    const [novoDependenteDraft, setNovoDependenteDraft] = useState(null);
    const [errosNovoDependente, setErrosNovoDependente] = useState({});
    const [camposTocadosNovoDependente, setCamposTocadosNovoDependente] = useState({});
    const modalInputRef = useRef(null);
    const modalTextareaRef = useRef(null);
    const onReviewDataChangeRef = useRef(onReviewDataChange);
    const camposPorPasso = 8;

    useEffect(() => {
        onReviewDataChangeRef.current = onReviewDataChange;
    }, [onReviewDataChange]);

    // Mapeia IDs para labels de campos com opções
    const getSelectOptionLabel = (fieldName, id) => {
        const optionsMap = {
            'RACA_COR': racaCorOptions,
            'ESTADO_CIVIL': estadoCivilOptions,
            'CAPACIDADE': capacidadeCodigoOptions,
            'VINCULO': vinculoCodigoOptions,
        };

        const options = optionsMap[fieldName];
        if (!options) return id;

        const option = options.find(o => o.value === String(id));
        return option ? option.label : id;
    };

    // Converte valor para label baseado no campo
    const converterValorParaLabel = (key, value) => {
        const chaveFinal = obterUltimaChaveNormalizada(key);
        const camposComOpcoes = ['RACA_COR', 'ESTADO_CIVIL', 'CAPACIDADE', 'VINCULO'];

        if (camposComOpcoes.includes(chaveFinal)) {
            return getSelectOptionLabel(chaveFinal, value);
        }

        return value;
    };



    const camposApiPorSecao = useMemo(() => {
        return montarCamposApiPorSecao(dadosFormulario || {});
    }, [dadosFormulario]);

    const valoresOriginaisPorChave = useMemo(() => {
        return montarValoresOriginaisPorChave(dadosFormulario || {});
    }, [dadosFormulario]);

    const temCampos = Object.values(camposApiPorSecao).some((campos) => campos.length > 0) || Object.prototype.hasOwnProperty.call(camposApiPorSecao, 'Dependentes');

    const passos = useMemo(() => {
        return montarPassos({
            camposApiPorSecao,
            mostrarCamposOcultos,
            novosDependentes,
            camposPorPasso,
        });
    }, [camposApiPorSecao, mostrarCamposOcultos, novosDependentes]);

    const ultimoPasso = passos.length - 1;
    const podeVoltar = passoAtual > 0;
    const podeAvancar = passoAtual < ultimoPasso;

    const irParaPasso = (indice) => {
        setPassoAtual(Math.min(Math.max(indice, 0), ultimoPasso));
    };

    const valorCampoAtual = (campo) => {
        if (Object.prototype.hasOwnProperty.call(camposEditados, campo.key)) {
            return camposEditados[campo.key];
        }

        return campo.value;
    };

    const abrirModalCampo = (campo) => {
        setCampoSelecionado(campo);
        const valorAtual = valorCampoAtual(campo);
        const valorExibido = converterValorParaLabel(campo.key, valorAtual);
        setValorModal(valorExibido);
        setModalAberto(true);
    };

    const handleValorModalChange = (key, value) => {
        const chaveFinal = obterUltimaChaveNormalizada(key);

        if (chaveFinal === 'CPF') {
            setValorModal(formatarCpf(value));
            return;
        }

        if (['TEL_CELULAR', 'TEL_OUTRO', 'TEL_RESIDENCIAL'].includes(chaveFinal)) {
            setValorModal(formatarTelefone(value));
            return;
        }

        if (['RACA_COR', 'ESTADO_CIVIL', 'CAPACIDADE', 'VINCULO'].includes(chaveFinal)) {
            setValorModal(getSelectOptionLabel(chaveFinal, value));
            return;
        }

        setValorModal(value);
    };

    const fecharModalCampo = () => {
        setModalAberto(false);
        setCampoSelecionado(null);
        setValorModal('');
    };

    const salvarModalCampo = () => {
        if (!campoSelecionado) return;

        setCamposEditados((prev) => {
            const proximo = { ...prev };

            if (valorModal === campoSelecionado.value) {
                delete proximo[campoSelecionado.key];
            } else {
                proximo[campoSelecionado.key] = valorModal;
            }

            return proximo;
        });

        fecharModalCampo();
    };

    const isCampoAlterado = (campo) => {
        if (!Object.prototype.hasOwnProperty.call(camposEditados, campo.key)) {
            return false;
        }

        return camposEditados[campo.key] !== campo.value;
    };

    const alternarRemocaoDependente = (tituloDependente) => {
        setDependentesParaRemover((prev) => ({
            ...prev,
            [tituloDependente]: !prev[tituloDependente],
        }));
    };

    const abrirModalNovoDependente = () => {
        setNovoDependenteDraft({ ...templateDependente });
        setErrosNovoDependente({});
        setCamposTocadosNovoDependente({});
        setModalNovoDependenteAberto(true);
    };

    const fecharModalNovoDependente = () => {
        setModalNovoDependenteAberto(false);
        setNovoDependenteDraft(null);
        setErrosNovoDependente({});
        setCamposTocadosNovoDependente({});
    };

    const atualizarCampoNovoDependente = (campo, valor) => {
        const valorNormalizado = normalizarValorDependente(campo, valor);

        setNovoDependenteDraft((prev) => {
            const proximoDraft = {
                ...prev,
                [campo]: valorNormalizado,
            };

            if (camposTocadosNovoDependente[campo]) {
                const erroCampo = validarCampoNovoDependente(campo, valorNormalizado, proximoDraft);
                setErrosNovoDependente((prevErros) => {
                    const proximoErros = { ...prevErros };
                    if (erroCampo) {
                        proximoErros[campo] = erroCampo;
                    } else {
                        delete proximoErros[campo];
                    }
                    return proximoErros;
                });
            }

            return proximoDraft;
        });
    };

    const tocarCampoNovoDependente = (campo) => {
        setCamposTocadosNovoDependente((prev) => ({ ...prev, [campo]: true }));

        if (!novoDependenteDraft) return;
        const erroCampo = validarCampoNovoDependente(campo, novoDependenteDraft[campo], novoDependenteDraft);
        setErrosNovoDependente((prev) => {
            const proximo = { ...prev };
            if (erroCampo) {
                proximo[campo] = erroCampo;
            } else {
                delete proximo[campo];
            }
            return proximo;
        });
    };

    const salvarNovoDependente = () => {
        if (!novoDependenteDraft) return;

        const camposObrigatorios = Object.keys(templateDependente);
        const tocados = camposObrigatorios.reduce((acc, campo) => ({ ...acc, [campo]: true }), {});
        setCamposTocadosNovoDependente(tocados);

        const validacao = validarNovoDependente(novoDependenteDraft);
        if (!validacao.valido) {
            setErrosNovoDependente(validacao.erros);
            return;
        }

        const novo = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            ...novoDependenteDraft,
        };

        setNovosDependentes((prev) => [...prev, novo]);
        fecharModalNovoDependente();
    };

    const removerNovoDependente = (id) => {
        setNovosDependentes((prev) => prev.filter((dep) => dep.id !== id));
    };

    const podeSalvarNovoDependente = useMemo(() => {
        if (!novoDependenteDraft) return false;
        return validarNovoDependente(novoDependenteDraft).valido;
    }, [novoDependenteDraft]);

    const possuiErrosNovoDependente = Object.keys(errosNovoDependente).length > 0;

    const alteracoesCampos = useMemo(() => {
        return Object.entries(camposEditados).map(([chave, valorNovo]) => ({
            chave,
            campo: labelFromKey(chave),
            valorAnterior: valoresOriginaisPorChave[chave] ?? '',
            valorNovo,
        }));
    }, [camposEditados, valoresOriginaisPorChave]);

    const dependentesParaRemoverLista = useMemo(() => {
        return Object.entries(dependentesParaRemover)
            .filter(([, ativo]) => Boolean(ativo))
            .map(([titulo]) => titulo);
    }, [dependentesParaRemover]);

    useEffect(() => {
        if (typeof onReviewDataChangeRef.current !== 'function') return;

        onReviewDataChangeRef.current({
            alteracoesCampos,
            novosDependentes,
            dependentesParaRemover: dependentesParaRemoverLista,
            resumo: {
                totalCamposAlterados: alteracoesCampos.length,
                totalNovosDependentes: novosDependentes.length,
                totalDependentesParaRemover: dependentesParaRemoverLista.length,
            },
        });
    }, [alteracoesCampos, novosDependentes, dependentesParaRemoverLista]);

    useEffect(() => {
        if (passoAtual > ultimoPasso) {
            setPassoAtual(Math.max(ultimoPasso, 0));
        }
    }, [passoAtual, ultimoPasso]);

    const usarCampoTextoSimplesNoModal =
        !String(valorModal || '').includes('\n') && String(valorModal || '').length <= 120;
    const isCampoSexoNoModal = Boolean(
        campoSelecionado && String(campoSelecionado.key || '').toUpperCase().split('.').pop() === 'SEXO'
    );
    const opcoesCampoSelecionadoNoModal = useMemo(() => {
        if (!campoSelecionado) return null;
        return getSelectOptionsByCampo(campoSelecionado.key, campoSelecionado.secao || '');
    }, [campoSelecionado]);
    const isCampoComSelectNoModal = Boolean(opcoesCampoSelecionadoNoModal?.length);

    useEffect(() => {
        if (!modalAberto || isCampoSexoNoModal || isCampoComSelectNoModal) {
            return;
        }

        const target = usarCampoTextoSimplesNoModal ? modalInputRef.current : modalTextareaRef.current;

        if (!target) {
            return;
        }

        target.focus();
        if (typeof target.setSelectionRange === 'function') {
            const length = String(target.value || '').length;
            target.setSelectionRange(length, length);
        }
    }, [modalAberto, isCampoSexoNoModal, isCampoComSelectNoModal, usarCampoTextoSimplesNoModal, valorModal]);

    if (!temCampos) return null;

    return (
        <div >
            <div className="mb-6 overflow-hidden rounded-2xl bg-white/15 p-4 ring-1 ring-white/20 backdrop-blur-md sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Informações Cadastrais</h3>
                        <p className="mt-1 text-sm text-white/70">
                            Arraste para o lado ou use os botoes para revisar por etapas.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {novosDependentes.length > 0 && (
                            <div className="rounded-md bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-100 ring-1 ring-amber-200/50">
                                {novosDependentes.length} novos dependentes vao ser adicionados
                            </div>
                        )}
                        {Object.values(dependentesParaRemover).some(Boolean) && (
                            <div className="rounded-full bg-rose-400/20 px-4 py-2 text-sm font-semibold text-rose-100 ring-1 ring-rose-200/50">
                                Remover {Object.values(dependentesParaRemover).filter(Boolean).length} dependente(s)
                            </div>
                        )}
                        <div className="rounded-md bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
                            Passo {passoAtual + 1} de {passos.length}
                        </div>
                    </div>
                </div>


                <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                    <motion.div
                        className="flex "
                        animate={{ x: `-${passoAtual * 100}%` }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.18}
                    >
                        {passos.map((passo, index) => (
                            <section
                                key={`${passo.titulo}-${index}`}
                                className={`min-w-full py-4 px-6 rounded-2xl transition-all ${dependentesParaRemover[passo.titulo] ? ' bg-rose-400/15 ' : ''}`}
                                aria-label={`Passo ${index + 1}: ${passo.titulo}`}
                            >
                                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
                                            Etapa {index + 1}
                                        </span>
                                        <h4 className="text-xl font-black text-white">
                                            {passo.titulo}
                                        </h4>
                                        {passo.subtitulo && (
                                            <p className="text-sm font-semibold text-cyan-100/80">
                                                {passo.subtitulo}
                                            </p>
                                        )}
                                    </div>
                                    <div className='flex flex-col items-end '>
                                        {isSecaoDependente(passo.titulo) && (
                                            <div className="mb-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {passo.camposVisiveis.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            onClick={abrirModalNovoDependente}
                                                            className="rounded-lg border border-emerald-200/50 bg-white/90 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-400/30 hover:text-white"
                                                        >
                                                            Adicionar dependentes
                                                        </button>
                                                    ) : (null)}
                                                    {isSecaoDependenteIndividual(passo.titulo) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => passo.ehNovoDependente ? removerNovoDependente(passo.novoDependenteId) : alternarRemocaoDependente(passo.titulo)}
                                                            className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${dependentesParaRemover[passo.titulo] && !passo.ehNovoDependente
                                                                ? 'border-rose-200/70 bg-white/90 text-rose-700 hover:text-white'
                                                                : 'border-rose-200/50 bg-white/90 text-rose-700 hover:bg-rose-400/30 hover:text-white'
                                                                }`}
                                                        >
                                                            {passo.ehNovoDependente
                                                                ? 'Excluir dependente'
                                                                : (dependentesParaRemover[passo.titulo] ? 'Cancelar remoção' : 'Remover dependente')}
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                </div>

                                {passo.camposVisiveis.length > 0 ? (
                                    <CamposVisiveisGrid
                                        passo={passo}
                                        abrirModalCampo={abrirModalCampo}
                                        getValorExibicaoCampo={getValorExibicaoCampo}
                                        isCampoAlterado={isCampoAlterado}
                                        valorCampoAtual={valorCampoAtual}
                                    />
                                ) : (
                                    <div className="rounded-xl p-5 text-sm text-white/75">
                                        {passo.semDados && passo.titulo === 'Dependentes' ? (
                                            <div className="flex min-h-32 items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={abrirModalNovoDependente}
                                                    className="rounded-xl border border-emerald-100/60 bg-emerald-400/15 px-5 py-3 text-base font-bold text-white transition hover:bg-emerald-400/30"
                                                >
                                                    + Adicionar Dependente
                                                </button>
                                            </div>
                                        ) : passo.semDados && isSecaoResponsavelLegal(passo.titulo) ? (
                                            <div className="flex min-h-32 items-center justify-center text-center text-base font-semibold text-white/80">
                                                Este usuário não tem um responsavel legal
                                            </div>
                                        ) : (
                                            'Os campos desta etapa estao ocultos. Use a opcao acima para mostrar campos sensiveis ou longos.'
                                        )}
                                    </div>
                                )}
                            </section>
                        ))}
                    </motion.div>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex justify-center gap-2 sm:justify-start">
                        {passos.map((passo, index) => (
                            <button
                                key={`dot-${index}`}
                                type="button"
                                onClick={() => irParaPasso(index)}
                                className={`h-3 rounded-full transition-all ${index === passoAtual
                                    ? 'w-10 bg-white'
                                    : 'w-3 bg-white/35 hover:bg-white/60'
                                    }`}
                                aria-label={`Ir para ${passo.titulo}`}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:flex">
                        {podeVoltar ? (
                            <button
                                type="button"
                                onClick={() => irParaPasso(passoAtual - 1)}
                                disabled={!podeVoltar}
                                className="rounded-xl border-2 border-white/30 px-5 py-1 text-base font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Anterior
                            </button>
                        ) : null}

                        {podeAvancar ? (
                            <button
                                type="button"
                                onClick={() => irParaPasso(passoAtual + 1)}
                                disabled={!podeAvancar}
                                className="rounded-xl bg-white px-5 py-1 text-base font-bold text-teal-700 transition hover:bg-teal-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Proximo
                            </button>
                        ) : null}

                    </div>
                </div>

                <CampoRevisaoModal
                    campoSelecionado={campoSelecionado}
                    fecharModalCampo={fecharModalCampo}
                    handleValorModalChange={handleValorModalChange}
                    isCampoComSelectNoModal={isCampoComSelectNoModal}
                    isCampoSexoNoModal={isCampoSexoNoModal}
                    modalAberto={modalAberto}
                    modalInputRef={modalInputRef}
                    modalTextareaRef={modalTextareaRef}
                    opcoesCampoSelecionadoNoModal={opcoesCampoSelecionadoNoModal || []}
                    salvarModalCampo={salvarModalCampo}
                    setValorModal={setValorModal}
                    usarCampoTextoSimplesNoModal={usarCampoTextoSimplesNoModal}
                    valorModal={valorModal}
                />
            </div>
            <NovoDependenteModal
                atualizarCampoNovoDependente={atualizarCampoNovoDependente}
                capacidadeOptions={capacidadeOptions}
                errosNovoDependente={errosNovoDependente}
                fecharModalNovoDependente={fecharModalNovoDependente}
                modalNovoDependenteAberto={modalNovoDependenteAberto}
                novoDependenteDraft={novoDependenteDraft}
                podeSalvarNovoDependente={podeSalvarNovoDependente}
                possuiErrosNovoDependente={possuiErrosNovoDependente}
                salvarNovoDependente={salvarNovoDependente}
                tocarCampoNovoDependente={tocarCampoNovoDependente}
                vinculoCodigoOptions={vinculoCodigoOptions}
            />
        </div>
    );
}
