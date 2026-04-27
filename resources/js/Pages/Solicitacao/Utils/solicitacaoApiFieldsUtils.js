import { camposPermitidosDadosPessoais } from './fieldData';
import {
    formatarCpf,
    formatarDataBr,
    formatarTelefone,
    formatInputValue,
    getHojeSemHorario,
    labelFromKey,
    obterUltimaChaveNormalizada,
    parseDataBr,
} from './fieldHelpers';
import {
    getSecao,
    isCampoBloqueadoResponsavelLegal,
    isSecaoDependente,
} from './fieldSectionHelpers';

export const isDataFimDependenciaExpirada = (valor = '') => {
    const dataFimDependencia = parseDataBr(valor);

    if (!dataFimDependencia) return false;

    return dataFimDependencia < getHojeSemHorario();
};

export const isDependenteAtivo = (dependente) => {
    const dataFim = String(
        dependente?.DATA_FIM_DEPENDENCIA ??
        dependente?.data_fim_dependencia ??
        ''
    ).trim();

    if (!dataFim) return true;

    return !isDataFimDependenciaExpirada(dataFim);
};

export const filtrarDependentesAtivos = (dados = {}) => {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        return dados;
    }

    const dependentesOriginais = dados.DEPENDENTES ?? dados.dependentes;

    if (!Array.isArray(dependentesOriginais)) {
        return dados;
    }

    const dependentesFiltrados = dependentesOriginais.filter(isDependenteAtivo);

    return {
        ...dados,
        ...(Array.isArray(dados.DEPENDENTES) ? { DEPENDENTES: dependentesFiltrados } : {}),
        ...(Array.isArray(dados.dependentes) ? { dependentes: dependentesFiltrados } : {}),
    };
};

export const isDataFimDependente = (key = '') => {
    const chave = obterUltimaChaveNormalizada(key);
    return chave === 'DATA_FIM_DEPENDENCIA' || chave === 'DATA_FIM_DEPENDENTE';
};

export const isSecaoDependenteExpirada = (titulo, campos = []) => {
    if (!isSecaoDependente(titulo)) return false;

    const campoDataFim = campos.find((campo) => isDataFimDependente(campo.key));
    if (!campoDataFim?.value) return false;

    return isDataFimDependenciaExpirada(campoDataFim.value);
};

export const normalizarValorDependente = (campo, valor) => {
    if (campo === 'CPF') return formatarCpf(valor);
    if (campo === 'DATA_NASCIMENTO' || campo === 'DATA_INICIO_DEPENDENCIA' || campo === 'DATA_FIM_DEPENDENCIA') {
        return formatarDataBr(valor);
    }

    return valor;
};

export const normalizarValorCampoApi = (key, valor) => {
    const chaveFinal = obterUltimaChaveNormalizada(key);

    if (chaveFinal === 'CPF') {
        return formatarCpf(valor);
    }

    if (['TEL_CELULAR', 'TEL_OUTRO', 'TEL_RESIDENCIAL'].includes(chaveFinal)) {
        return formatarTelefone(valor);
    }

    return formatInputValue(valor);
};

export const flattenApiData = (obj, parentKey = '') => {
    if (!obj || typeof obj !== 'object') return [];

    if (Array.isArray(obj)) {
        return obj.flatMap((item, index) =>
            flattenApiData(item, `${parentKey}[${index}]`)
        );
    }

    return Object.entries(obj).flatMap(([key, value]) => {
        const compoundKey = parentKey ? `${parentKey}.${key}` : key;

        if (value && typeof value === 'object') {
            return flattenApiData(value, compoundKey);
        }

        return [{ key: compoundKey, value: normalizarValorCampoApi(compoundKey, value) }];
    });
};

export const isCampoOcultavel = (key, value) => {
    const keyUpper = key.toUpperCase();
    const valor = value || '';

    const campoSensivel =
        keyUpper.includes('SENHA') ||
        keyUpper.includes('ROSTO') ||
        keyUpper.includes('ASSINATURA') ||
        keyUpper.includes('BIOMETRIA') ||
        keyUpper.includes('FOTO');

    const campoMuitoGrande = valor.length > 180;

    return campoSensivel || campoMuitoGrande;
};

export const montarCamposApiPorSecao = (dadosFormulario = {}) => {
    const campos = flattenApiData(filtrarDependentesAtivos(dadosFormulario || {}));
    const secoes = {};

    campos.forEach((campo) => {
        const chaveNormalizada = String(campo.key || '')
            .toUpperCase()
            .replace(/^(?:\[\d+\]\.?)*/, '');
        const ultimaChaveNormalizada = chaveNormalizada
            .split('.')
            .pop()
            .replace(/\[\d+\]/g, '');

        const secao = getSecao(campo.key);
        const ehCampoContainerDependentes =
            secao === 'Dependentes' && /^(DEPENDENTES|DEPENDENTE)$/.test(chaveNormalizada);
        const ehCampoContainerResponsavelLegal =
            secao === 'Responsável Legal' && /^(RESPONSAVEIS?_LEGAIS?|RESPONSAVEL(?:_LEGAL)?)$/.test(chaveNormalizada);
        const ehCampoForaDaListaDadosPessoais =
            secao === 'Dados Pessoais' && !camposPermitidosDadosPessoais.has(ultimaChaveNormalizada);
        const ehCampoOcultoResponsavelLegal = isCampoBloqueadoResponsavelLegal(campo.key);

        if (
            ehCampoContainerDependentes ||
            ehCampoContainerResponsavelLegal ||
            ehCampoForaDaListaDadosPessoais ||
            ehCampoOcultoResponsavelLegal
        ) {
            return;
        }

        const item = {
            ...campo,
            secao,
            label: labelFromKey(campo.key),
            ocultavel: isCampoOcultavel(campo.key, campo.value),
        };

        if (!secoes[secao]) {
            secoes[secao] = [];
        }

        secoes[secao].push(item);
    });

    Object.keys(secoes).forEach((secao) => {
        if (isSecaoDependenteExpirada(secao, secoes[secao])) {
            delete secoes[secao];
        }
    });

    const temDadosDependente = Object.keys(secoes).some(
        (secao) => secao === 'Dependentes' || secao.startsWith('Dependente ')
    );

    if (!temDadosDependente) {
        secoes.Dependentes = [];
    }

    const temDadosResponsavelLegal = Object.keys(secoes).some(
        (secao) => secao === 'Responsável Legal' || secao.startsWith('Responsável Legal ')
    );

    if (!temDadosResponsavelLegal) {
        secoes['Responsável Legal'] = [];
    }

    return secoes;
};

export const montarValoresOriginaisPorChave = (dadosFormulario = {}) => {
    const mapa = {};
    flattenApiData(filtrarDependentesAtivos(dadosFormulario || {})).forEach((item) => {
        mapa[item.key] = item.value;
    });

    return mapa;
};

export const montarPassos = ({
    camposApiPorSecao,
    mostrarCamposOcultos,
    novosDependentes,
    camposPorPasso,
}) => {
    const passosBase = Object.entries(camposApiPorSecao)
        .flatMap(([secao, campos]) => {
            const camposVisiveis = campos.filter((campo) => mostrarCamposOcultos || !campo.ocultavel);
            const semDados = campos.length === 0;

            if (camposVisiveis.length === 0) {
                return [{
                    titulo: secao,
                    subtitulo: semDados ? null : 'Campos ocultos',
                    campos,
                    camposVisiveis: [],
                    semDados,
                }];
            }

            const totalPartes = Math.ceil(camposVisiveis.length / camposPorPasso);

            return Array.from({ length: totalPartes }, (_, parte) => {
                const inicio = parte * camposPorPasso;
                const fim = inicio + camposPorPasso;

                return {
                    titulo: secao,
                    subtitulo: totalPartes > 1 ? `Parte ${parte + 1} de ${totalPartes}` : null,
                    campos,
                    camposVisiveis: camposVisiveis.slice(inicio, fim),
                    semDados,
                };
            });
        });

    const maiorIndiceDependenteExistente = passosBase.reduce((maior, passo) => {
        const match = passo.titulo.match(/^Dependente (\d+)$/);
        if (!match) return maior;
        return Math.max(maior, parseInt(match[1], 10));
    }, 0);

    const passosNovosDependentes = novosDependentes.map((dependente, idx) => {
        const numeroDependente = maiorIndiceDependenteExistente + idx + 1;
        const campos = Object.entries(dependente)
            .filter(([chave]) => chave !== 'id')
            .map(([chave, valor]) => ({
                key: `NOVOS_DEPENDENTES[${idx}].${chave}`,
                label: labelFromKey(chave),
                value: formatInputValue(valor),
                ocultavel: false,
            }));

        return {
            titulo: `Dependente ${numeroDependente}`,
            subtitulo: 'Novo dependente',
            campos,
            camposVisiveis: campos,
            semDados: false,
            ehNovoDependente: true,
            novoDependenteId: dependente.id,
        };
    });

    const passosBaseFiltrados = passosBase.filter(
        (passo) => !(passo.titulo === 'Dependentes' && passo.semDados && novosDependentes.length > 0)
    );

    const indicePrimeiroResponsavelLegal = passosBaseFiltrados.findIndex(
        (passo) => passo.titulo === 'Responsável Legal' || passo.titulo.startsWith('Responsável Legal ')
    );

    if (indicePrimeiroResponsavelLegal === -1) {
        return [...passosBaseFiltrados, ...passosNovosDependentes];
    }

    return [
        ...passosBaseFiltrados.slice(0, indicePrimeiroResponsavelLegal),
        ...passosNovosDependentes,
        ...passosBaseFiltrados.slice(indicePrimeiroResponsavelLegal),
    ];
};
