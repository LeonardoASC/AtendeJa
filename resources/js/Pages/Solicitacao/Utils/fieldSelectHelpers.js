import {
    capacidadeCodigoOptions,
    estadoCivilOptions,
    racaCorOptions,
    vinculoCodigoOptions,
} from './fieldData';
import { formatInputValue, obterUltimaChaveNormalizada } from './fieldHelpers';

const normalizarCodigoOpcao = (value) => {
    const texto = String(value ?? '').trim();
    if (!texto) return '';
    return texto;
};

const isSecaoDadosPessoais = (secao = '') => secao === 'Dados Pessoais';
const isSecaoDependentePorNome = (secao = '') => secao === 'Dependentes' || secao.startsWith('Dependente ');
const isSecaoResponsavelLegalPorNome = (secao = '') => secao === 'Responsável Legal' || secao.startsWith('Responsável Legal ');

export const getSelectOptionsByCampo = (key = '', secao = '') => {
    const ultimaChave = obterUltimaChaveNormalizada(key);

    if (ultimaChave === 'ESTADO_CIVIL' && (isSecaoDadosPessoais(secao) || isSecaoResponsavelLegalPorNome(secao))) {
        return estadoCivilOptions;
    }

    if (ultimaChave === 'RACA_COR' && isSecaoDadosPessoais(secao)) {
        return racaCorOptions;
    }

    if (ultimaChave === 'CAPACIDADE' && (isSecaoDadosPessoais(secao) || isSecaoDependentePorNome(secao))) {
        return capacidadeCodigoOptions;
    }

    if (ultimaChave === 'VINCULO' && isSecaoDependentePorNome(secao)) {
        return vinculoCodigoOptions;
    }

    return null;
};

export const formatarValorParaExibicaoPorOpcoes = (valor, options) => {
    if (!options || options.length === 0) {
        return formatInputValue(valor);
    }

    const codigo = normalizarCodigoOpcao(valor);
    const opcao = options.find((item) => item.value === codigo);

    return opcao ? opcao.label : formatInputValue(valor);
};

export const getValorExibicaoCampo = (campo, valor) => {
    const options = getSelectOptionsByCampo(campo.key, campo.secao || '');
    return formatarValorParaExibicaoPorOpcoes(valor, options);
};
