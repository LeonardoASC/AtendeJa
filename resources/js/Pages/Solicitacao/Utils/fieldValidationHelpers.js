import { capacidadeOptions, vinculoOptions } from './fieldData';
import { isDataBrValida, somenteDigitos } from './fieldHelpers';

export const validarNovoDependente = (dependente) => {
    const erros = {};
    if (!dependente) return { valido: false, erros: { geral: 'Dados do dependente nao encontrados.' } };

    const camposObrigatorios = [
        'NOME',
        'DATA_NASCIMENTO',
        'SEXO',
        'CPF',
        'CAPACIDADE',
        'VINCULO',
        'DATA_INICIO_DEPENDENCIA',
    ];

    Object.entries(dependente).forEach(([campo, valor]) => {
        const preenchido = String(valor || '').trim().length > 0;
        if (camposObrigatorios.includes(campo) && !preenchido) {
            erros[campo] = 'Campo obrigatorio.';
        }
    });

    if (!erros.CPF && somenteDigitos(dependente.CPF).length !== 11) {
        erros.CPF = 'CPF deve ter 11 digitos.';
    }

    ['DATA_NASCIMENTO', 'DATA_INICIO_DEPENDENCIA', 'DATA_FIM_DEPENDENCIA'].forEach((campoData) => {
        const valorData = String(dependente[campoData] || '').trim();
        if (!valorData && campoData === 'DATA_FIM_DEPENDENCIA') {
            return;
        }

        if (!erros[campoData] && !isDataBrValida(valorData)) {
            erros[campoData] = 'Data invalida. Use DD/MM/AAAA.';
        }
    });

    const valido = Object.keys(erros).length === 0;
    return { valido, erros };
};

export const validarCampoNovoDependente = (campo, valor, dependente) => {
    const texto = String(valor || '').trim();

    if (campo === 'DATA_FIM_DEPENDENCIA' && !texto) {
        return null;
    }

    if (!texto) return 'Campo obrigatorio.';

    if (campo === 'CPF' && somenteDigitos(texto).length !== 11) {
        return 'CPF deve ter 11 digitos.';
    }

    if (
        (campo === 'DATA_NASCIMENTO' || campo === 'DATA_INICIO_DEPENDENCIA' || campo === 'DATA_FIM_DEPENDENCIA') &&
        !isDataBrValida(texto)
    ) {
        return 'Data invalida. Use DD/MM/AAAA.';
    }

    if (campo === 'SEXO' && !['M', 'F'].includes(texto)) {
        return 'Selecione o sexo.';
    }

    if (campo === 'CAPACIDADE' && !capacidadeOptions.includes(texto)) {
        return 'Selecione a capacidade.';
    }

    if (campo === 'VINCULO' && !vinculoOptions.includes(texto)) {
        return 'Selecione o vinculo.';
    }

    if (!dependente) return null;
    return null;
};
