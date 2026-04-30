export const capacidadeOptions = ['VALIDO', 'INVALIDO'];

export const estadoCivilOptions = [
    { value: '2', label: 'CASADO (A)' },
    { value: '3', label: 'DIVORCIADO (A)' },
    { value: '5', label: 'SEPARADO (A) JUDICIALMENTE' },
    { value: '6', label: 'SOLTEIRO (A)' },
    { value: '7', label: 'UNIAO ESTAVEL' },
    { value: '8', label: 'VIUVO (A)' },
];

export const racaCorOptions = [
    { value: '1', label: 'Indigena' },
    { value: '2', label: 'Branca' },
    { value: '4', label: 'Preta' },
    { value: '6', label: 'Amarela' },
    { value: '8', label: 'Parda' },
];

export const capacidadeCodigoOptions = [
    { value: '1', label: 'Valido' },
    { value: '2', label: 'Invalido' },
];

export const vinculoCodigoOptions = [
    { value: '1', label: 'CONJUGE' },
    { value: '2', label: 'COMPANHEIRO(A)' },
    { value: '3', label: 'FILHO(A) MENOR NAO EMANCIPADO(A)' },
    { value: '4', label: 'FILHO(A) INVALIDO(A)' },
    { value: '5', label: 'PAI/MAE COM DEPENDENCIA ECONOMICA' },
    { value: '6', label: 'Enteado(A) Menor De 21 Anos Nao Emancipado(A) Com Dependência Econômica' },
    { value: '7', label: 'Enteado(A) Inválido(A) Com Dependência Econômica' },
    { value: '8', label: 'Irmão(A) Menor De 21 Anos Nao Emancipado(A) Com Dependência Econômica' },
    { value: '9', label: 'Irmão(A) Inválido(A) Com Dependência Econômica' },
    { value: '10', label: 'Menor De 21 Anos Tutelado' },
    { value: '11', label: 'Neto(a)' },
    { value: '12', label: 'Ex-Cônjuge Que Receba Pensão De Alimentos' },
];

export const templateDependente = {
    NOME: '',
    DATA_NASCIMENTO: '',
    SEXO: '',
    CPF: '',
    CAPACIDADE: '',
    VINCULO: '',
    DATA_INICIO_DEPENDENCIA: '',
    DATA_FIM_DEPENDENCIA: '',
};

export const camposPermitidosDadosPessoais = new Set([
    'NOME',
    'MATRICULA',
    'CPF',
    'EMAIL',
    'CARTEIRA_IDENTIDADE',
    'NOME_SOCIAL',
    'DATA_NASCIMENTO',
    'SEXO',
    'ESTADO_CIVIL',
    'RACA_COR',
    'CAPACIDADE',
    'PIS_PASEP',
    'ENDERECO',
    'NUMERO',
    'COMPLEMENTO',
    'BAIRRO',
    'CIDADE',
    'ESTADO',
    'CEP',
    'TEL_RESIDENCIAL',
    'TEL_CELULAR',
    'TEL_OUTRO',
    'MATRICULA_FUNCIONAL',
    'TIPO_VINCULO',
    'DEPENDENTES',
    'RESPONSAVEIS_LEGAIS',
]);

export const camposBloqueadosResponsavelLegal = new Set([
    'GRAU_INSTRUCAO',
    'RG',
    'ORG_EXPEDIDOR',
    "CARTEIRA_IDENTIDADE",
    'UF_RG',
    'UF_IDENT',
    'DATA_EXP',
    'RESP_LEGAL_TIPO',
    'RESP_LEGAL_RECEBIMENTOS',
    'RESP_LEGAL_DATA_INICIO',
    'RESP_LEGAL_DATA_FIM',
]);
