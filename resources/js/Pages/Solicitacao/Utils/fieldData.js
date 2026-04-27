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
    { value: '3', label: 'FILHO(A) NAO EMANCIPADO MENOR DE 21 ANOS' },
    { value: '4', label: 'FILHO(A) INVALIDO(A)' },
    { value: '5', label: 'PAI/MAE COM DEPENDENCIA ECONOMICA' },
    { value: '6', label: 'IRMAO/IRMA NAO EMANCIPADO(A) MENOR DE 21 ANOS COM DEPENDENCIA ECONOMICA' },
    { value: '7', label: 'IRMAO/IRMA INVALIDO(A) COM DEPENDENCIA ECONOMICA' },
    { value: '8', label: 'ENTEADO NAO EMANCIPADO MENOR DE 21 ANOS COM DEPENDENCIA ECONOMICA' },
    { value: '9', label: 'ENTEADO INVALIDO COM DEPENDENCIA ECONOMICA' },
    { value: '10', label: 'MENOR TUTELADO NAO EMANCIPADO MENOR DE 21 ANOS COM DEPENDENCIA ECONOMICA' },
    { value: '11', label: 'MENOR TUTELADO INVALIDO COM DEPENDENCIA ECONOMICA' },
    { value: '15', label: 'FILHO(A) MAIOR DE 21 ANOS' },
    { value: '21', label: 'Filho ou enteado ate 21 anos, ou maior, se incapacitado fisica e/ou mentalmente' },
    { value: '22', label: 'Filho ou enteado ate 24 anos, se universitario ou cursando escola tecnica de 2o grau' },
    { value: '23', label: 'OUTROS' },
    { value: '24', label: 'Irmao, neto ou bisneto sem arrimo ate 21 anos, ou incapaz fisica/mentalmente' },
    { value: '25', label: 'Irmao, neto ou bisneto sem arrimo ate 24 anos, em universidade ou escola tecnica' },
    { value: '26', label: 'Filho ou enteado ate 18 anos, ou maior, se incapacitado fisica e/ou mentalmente' },
    { value: '27', label: 'Pessoa absolutamente incapaz da qual o contribuinte seja tutor ou curador' },
    { value: '28', label: 'Neto(a)' },
    { value: '29', label: 'Pais, avos, bisavos, que receberam rendimentos tributaveis' },
    { value: '30', label: 'Menor pobre ate 21 anos que o contribuinte crie, eduque e detenha guarda judicial' },
    { value: '31', label: 'EX-CONJUGE' },
];

export const vinculoOptions = [
    'COMPANHEIRO(A)',
    'CONJUGE',
    'ENTEADO INVALIDO COM DEPENDENCIA ECONOMICA',
    'ENTEADO NAO EMANCIPADO MENOR DE 21 ANOS COM DEPENDENCIA ECONOMICA',
    'EX-CONJUGE',
    'Filho ou enteado ate 18 anos, ou maior, se incapacitado fisica e/ou mentalmente',
    'Filho ou enteado ate 21 anos, ou maior, se incapacitado fisica e/ou mentalmente',
    'Filho ou enteado ate 24 anos, se universitario ou cursando escola tecnica de 2o grau',
    'FILHO(A) INVALIDO(A)',
    'FILHO(A) MAIOR DE 21 ANOS',
    'FILHO(A) NAO EMANCIPADO MENOR DE 21 ANOS',
    'IRMAO / IRMA INVALIDO(A) COM DEPENDENCIA ECONOMICA',
    'IRMAO / IRMA NAO EMANCIPADO(A) MENOR DE 21 ANOS COM DEPENDENCIA ECONOMICA',
    'Irmao, neto ou bisneto sem arrimo ate 21 anos, ou incapaz fisica/mentalmente',
    'Irmao, neto ou bisneto sem arrimo ate 24 anos, em universidade ou escola tecnica',
    'Menor pobre ate 21 anos que crie e eduque e detenha guarda judicial',
    'MENOR TUTELADO INVALIDO COM DEPENDENCIA ECONOMICA',
    'MENOR TUTELADO NAO EMANCIPADO MENOR DE 21 ANOS COM DEPENDENCIA ECONOMICA',
    'Neto(a)',
    'OUTROS',
    'PAI (MAE) COM DEPENDENCIA ECONOMICA',
    'Pais, avos, bisavos, que receberam rendimentos tributaveis',
    'Pessoa absolutamente incapaz da qual o contribuinte seja tutor ou curador',
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
