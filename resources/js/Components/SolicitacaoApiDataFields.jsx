import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
    const camposPorPasso = 8;

    const templateDependente = {
        NOME: '',
        DATA_NASCIMENTO: '',
        SEXO: '',
        CPF: '',
        CAPACIDADE: '',
        VINCULO: '',
        DATA_INICIO_DEPENDENCIA: '',
        DATA_FIM_DEPENDENCIA: '',
    };

    const capacidadeOptions = ['VALIDO', 'INVALIDO'];

    const estadoCivilOptions = [
        { value: '1', label: 'Nao Informado' },
        { value: '2', label: 'CASADO (A)' },
        { value: '3', label: 'DIVORCIADO (A)' },
        { value: '4', label: 'Nao Informado' },
        { value: '5', label: 'SEPARADO (A) JUDICIALMENTE' },
        { value: '6', label: 'SOLTEIRO (A)' },
        { value: '7', label: 'UNIAO ESTAVEL' },
        { value: '8', label: 'VIUVO (A)' },
    ];

    const racaCorOptions = [
        { value: '1', label: 'Indigena' },
        { value: '2', label: 'Branca' },
        { value: '4', label: 'Preta' },
        { value: '6', label: 'Amarela' },
        { value: '8', label: 'Parda' },
        { value: '9', label: 'Nao Informado' },
    ];

    const capacidadeCodigoOptions = [
        { value: '1', label: 'Valido' },
        { value: '2', label: 'Invalido' },
    ];

    const vinculoCodigoOptions = [
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

    const vinculoOptions = [
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

    const camposPermitidosDadosPessoais = new Set([
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

    const camposBloqueadosResponsavelLegal = new Set([
        'GRAU_INSTRUCAO',
        'RG',
        'ORGAO_EXPEDIDOR',
        'UF_RG',
        'DATA_EXP',
        'RESP_LEGAL_TIPO',
        'RESP_LEGAL_RECEBIMENTOS',
        'RESP_LEGAL_DATA_INICIO',
        'RESP_LEGAL_DATA_FIM',
    ]);

    const isCampoBloqueadoResponsavelLegal = (key = '') => {
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

    const formatInputValue = (value) => {
        if (value === null || value === undefined) return '';

        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch {
                return String(value);
            }
        }

        return String(value);
    };

    const somenteDigitos = (value = '') => String(value).replace(/\D/g, '');

    const formatarCpf = (value = '') => {
        const digits = somenteDigitos(value).slice(0, 11);

        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    };

    const formatarTelefone = (value = '') => {
        const digits = somenteDigitos(value).slice(0, 11);

        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const formatarDataBr = (value = '') => {
        const digits = somenteDigitos(value).slice(0, 8);

        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    };

    const isDataBrValida = (value = '') => {
        const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return false;

        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10);
        const ano = parseInt(match[3], 10);

        if (mes < 1 || mes > 12 || dia < 1) return false;

        const data = new Date(ano, mes - 1, dia);
        return data.getFullYear() === ano && data.getMonth() === (mes - 1) && data.getDate() === dia;
    };

    const parseDataBr = (value = '') => {
        if (Array.isArray(value)) return null;

        const texto = String(value ?? '').trim();
        if (!texto || texto === '[]') return null;

        const match = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return null;

        const dia = Number(match[1]);
        const mes = Number(match[2]);
        const ano = Number(match[3]);

        const data = new Date(ano, mes - 1, dia);
        if (
            Number.isNaN(data.getTime()) ||
            data.getFullYear() !== ano ||
            data.getMonth() !== mes - 1 ||
            data.getDate() !== dia
        ) {
            return null;
        }

        return data;
    };

    const getHojeSemHorario = () => {
        const hoje = new Date();
        return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    };

    const isDataFimDependenciaExpirada = (valor = '') => {
        const dataFimDependencia = parseDataBr(valor);

        if (!dataFimDependencia) return false;

        return dataFimDependencia < getHojeSemHorario();
    };

    const isDependenteAtivo = (dependente) => {
        const dataFim = String(
            dependente?.DATA_FIM_DEPENDENCIA ??
            dependente?.data_fim_dependencia ??
            ''
        ).trim();

        if (!dataFim) return true;

        return !isDataFimDependenciaExpirada(dataFim);
    };

    const filtrarDependentesAtivos = (dados = {}) => {
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

    const isDataFimDependente = (key = '') => {
        const chave = obterUltimaChaveNormalizada(key);
        return chave === 'DATA_FIM_DEPENDENCIA' || chave === 'DATA_FIM_DEPENDENTE';
    };

    const isSecaoDependente = (titulo = '') => titulo === 'Dependentes' || titulo.startsWith('Dependente ');

    const isSecaoDependenteExpirada = (titulo, campos = []) => {
        if (!isSecaoDependente(titulo)) return false;

        const campoDataFim = campos.find((campo) => isDataFimDependente(campo.key));
        if (!campoDataFim?.value) return false;

        return isDataFimDependenciaExpirada(campoDataFim.value);
    };

    const normalizarValorDependente = (campo, valor) => {
        if (campo === 'CPF') return formatarCpf(valor);
        if (campo === 'DATA_NASCIMENTO' || campo === 'DATA_INICIO_DEPENDENCIA' || campo === 'DATA_FIM_DEPENDENCIA') {
            return formatarDataBr(valor);
        }

        return valor;
    };

    const obterUltimaChaveNormalizada = (key = '') => String(key)
        .toUpperCase()
        .split('.')
        .pop()
        .replace(/\[\d+\]/g, '');

    const normalizarValorCampoApi = (key, valor) => {
        const chaveFinal = obterUltimaChaveNormalizada(key);

        if (chaveFinal === 'CPF') {
            return formatarCpf(valor);
        }

        if (['TEL_CELULAR', 'TEL_OUTRO', 'TEL_RESIDENCIAL'].includes(chaveFinal)) {
            return formatarTelefone(valor);
        }

        return formatInputValue(valor);
    };

    const validarNovoDependente = (dependente) => {
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

    const validarCampoNovoDependente = (campo, valor, dependente) => {
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

    const flattenApiData = (obj, parentKey = '') => {
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

    const labelFromKey = (key) => {
        const ultimoItem = key.split('.').pop();
        return ultimoItem.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const getSecao = (key) => {
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

    const normalizarCodigoOpcao = (value) => {
        const texto = String(value ?? '').trim();
        if (!texto) return '';
        return texto;
    };

    const isSecaoDadosPessoais = (secao = '') => secao === 'Dados Pessoais';
    const isSecaoDependentePorNome = (secao = '') => secao === 'Dependentes' || secao.startsWith('Dependente ');
    const isSecaoResponsavelLegalPorNome = (secao = '') => secao === 'Responsável Legal' || secao.startsWith('Responsável Legal ');

    const getSelectOptionsByCampo = (key = '', secao = '') => {
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

    const formatarValorParaExibicaoPorOpcoes = (valor, options) => {
        if (!options || options.length === 0) {
            return formatInputValue(valor);
        }

        const codigo = normalizarCodigoOpcao(valor);
        const opcao = options.find((item) => item.value === codigo);

        return opcao ? opcao.label : formatInputValue(valor);
    };

    const getValorExibicaoCampo = (campo, valor) => {
        const options = getSelectOptionsByCampo(campo.key, campo.secao || '');
        return formatarValorParaExibicaoPorOpcoes(valor, options);
    };

    const isCampoOcultavel = (key, value) => {
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

    const camposApiPorSecao = useMemo(() => {
        const campos = flattenApiData(filtrarDependentesAtivos(dadosFormulario || {}));
        const secoes = {}; // ← dinâmico, sem chaves fixas

        campos.forEach((campo) => {
            const chaveNormalizada = String(campo.key || '')
                .toUpperCase()
                .replace(/^(?:\[\d+\]\.?)+/, '');
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
                secoes[secao] = []; // ← cria a seção se não existir
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
    }, [dadosFormulario]);

    const valoresOriginaisPorChave = useMemo(() => {
        const mapa = {};
        flattenApiData(filtrarDependentesAtivos(dadosFormulario || {})).forEach((item) => {
            mapa[item.key] = item.value;
        });

        return mapa;
    }, [dadosFormulario]);


    const temCampos = Object.values(camposApiPorSecao).some((campos) => campos.length > 0) || Object.prototype.hasOwnProperty.call(camposApiPorSecao, 'Dependentes');

    const passos = useMemo(() => {
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
        setValorModal(valorCampoAtual(campo));
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

    const isSecaoDependenteIndividual = (titulo) => titulo.startsWith('Dependente ');
    const isSecaoResponsavelLegal = (titulo) => titulo === 'Responsável Legal' || titulo.startsWith('Responsável Legal ');

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
        if (typeof onReviewDataChange !== 'function') return;

        onReviewDataChange({
            alteracoesCampos,
            novosDependentes,
            dependentesParaRemover: dependentesParaRemoverLista,
            resumo: {
                totalCamposAlterados: alteracoesCampos.length,
                totalNovosDependentes: novosDependentes.length,
                totalDependentesParaRemover: dependentesParaRemoverLista.length,
            },
        });
    }, [onReviewDataChange, alteracoesCampos, novosDependentes, dependentesParaRemoverLista]);

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

                {modalAberto && campoSelecionado && (
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
                                    <option value="">SEXO</option>
                                    <option value="M">MASCULINO</option>
                                    <option value="F">FEMININO</option>
                                </select>
                            ) : isCampoComSelectNoModal ? (
                                <select
                                    value={valorModal}
                                    onChange={(event) => setValorModal(event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                                >
                                    <option value="">{String(campoSelecionado.label || '').toUpperCase()}</option>
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
                )}
            </div>
            {modalNovoDependenteAberto && novoDependenteDraft && (
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
            )}
        </div>
    );
}
