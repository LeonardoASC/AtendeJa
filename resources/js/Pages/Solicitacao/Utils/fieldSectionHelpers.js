import { camposBloqueadosResponsavelLegal } from './fieldData';

export const isSecaoDependente = (titulo = '') => titulo === 'Dependentes' || titulo.startsWith('Dependente ');

export const isSecaoDependenteIndividual = (titulo = '') => titulo.startsWith('Dependente ');

export const isSecaoResponsavelLegal = (titulo = '') => titulo === 'Responsável Legal' || titulo.startsWith('Responsável Legal ');

export const getSecao = (key = '') => {
    const chave = String(key || '').toUpperCase();
    const chaveSemPrefixoIndice = chave.replace(/^(?:\[\d+\]\.?)+/, '');

    const ehDependente =
        /^DEPENDENTES(?:\.|\[|$)/.test(chaveSemPrefixoIndice) ||
        /^DEPENDENTE(?:\.|\[|$)/.test(chaveSemPrefixoIndice);

    if (ehDependente) {
        const indice = chaveSemPrefixoIndice.match(/\[(\d+)\]/);
        if (indice) return `Dependente ${parseInt(indice[1], 10) + 1}`;
        return 'Dependentes';
    }

    const ehResponsavelLegal =
        /^RESPONSAVEIS?_LEGAIS?(?:\.|\[|$)/.test(chaveSemPrefixoIndice) ||
        /^RESPONSAVEL(?:_LEGAL)?(?:\.|\[|$)/.test(chaveSemPrefixoIndice);

    if (ehResponsavelLegal) {
        const indice = chaveSemPrefixoIndice.match(/\[(\d+)\]/);
        if (indice) return `Responsável Legal ${parseInt(indice[1], 10) + 1}`;
        return 'Responsável Legal';
    }

    return 'Dados Pessoais';
};

export const isCampoBloqueadoResponsavelLegal = (key = '') => {
    const chaveNormalizada = String(key || '')
        .toUpperCase()
        .replace(/^(?:\[\d+\]\.?)*/, '');

    if (!/^RESPONS/.test(chaveNormalizada)) {
        return false;
    }

    const ultimaChaveNormalizada = chaveNormalizada
        .split('.')
        .pop()
        .replace(/\[\d+\]/g, '');

    return camposBloqueadosResponsavelLegal.has(ultimaChaveNormalizada);
};
