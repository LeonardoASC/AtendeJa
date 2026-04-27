export const formatInputValue = (value) => {
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

export const somenteDigitos = (value = '') => String(value).replace(/\D/g, '');

export const formatarCpf = (value = '') => {
    const digits = somenteDigitos(value).slice(0, 11);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const formatarTelefone = (value = '') => {
    const digits = somenteDigitos(value).slice(0, 11);

    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const formatarDataBr = (value = '') => {
    const digits = somenteDigitos(value).slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const isDataBrValida = (value = '') => {
    const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return false;

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const ano = parseInt(match[3], 10);

    if (mes < 1 || mes > 12 || dia < 1) return false;

    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano && data.getMonth() === (mes - 1) && data.getDate() === dia;
};

export const parseDataBr = (value = '') => {
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

export const getHojeSemHorario = () => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
};

export const obterUltimaChaveNormalizada = (key = '') => String(key)
    .toUpperCase()
    .split('.')
    .pop()
    .replace(/\[\d+\]/g, '');

export const labelFromKey = (key) => {
    const ultimoItem = key.split('.').pop();
    return ultimoItem.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};
