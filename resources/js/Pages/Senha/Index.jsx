import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingModal from '@/Components/LoadingModal';
import { motion, AnimatePresence } from "framer-motion";
import { CursorArrowRaysIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';


const isNomeCompletoValido = (nome) => {
    if (!nome) return false;
    const sanitized = nome.trim().replace(/\s+/g, ' ');
    const parts = sanitized.split(' ');
    if (parts.length < 2) return false;

    const stopwords = ['de', 'da', 'do', 'das', 'dos', 'e', 'd'];
    const meaningful = parts.filter(p => !stopwords.includes(p.toLowerCase()));

    if (meaningful.length < 2) return false;

    const alpha = /^[A-Za-zÀ-ÿ'-]{2,}$/;
    const first = meaningful[0];
    const last = meaningful[meaningful.length - 1];

    return alpha.test(first) && alpha.test(last);
};

export default function Index({ tipoAtendimentos }) {
    const [step, setStep] = useState(0);
    const [buscando, setBuscando] = useState(false);
    const [lookupError, setLookupError] = useState(null);
    const [pessoa, setPessoa] = useState(null);
    const [showNomeInput, setShowNomeInput] = useState(false);
    const [showNomeModal, setShowNomeModal] = useState(false);
    const [tempNome, setTempNome] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        tipo_atendimento_id: '',
        cpf: '',
        email: '',
        nome: '',
        matricula: '',
    });

    const steps = ['Início', 'Serviço', 'CPF', 'Concluído'];

    const handleDigit = (d) => data.cpf.length < 11 && setData('cpf', data.cpf + d);
    const handleBackspace = () => setData('cpf', data.cpf.slice(0, -1));
    const handleClear = () => setData('cpf', '');

    useEffect(() => {
        if (step !== 2) return;

        if (data.cpf.length === 11) {
            const controller = new AbortController();
            setBuscando(true);
            setLookupError(null);

            axios
                .get(route('busca.cpf.search'), {
                    params: { CPF: data.cpf },
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                })
                .then(({ data: json }) => {
                    const first = Array.isArray(json?.data) ? json.data[0] : null;

                    if (first?.NOME) {
                        setPessoa(first);

                        setData('nome', first.NOME || '');
                        setData('matricula', first.MATRICULA || '');
                        setData('email', first.EMAIL ? String(first.EMAIL).toLowerCase() : '');

                        setShowNomeInput(false);
                    } else {
                        setPessoa(null);
                        setData('nome', '');
                        setData('matricula', '');
                        setData('email', '');
                        setShowNomeInput(true);
                        setShowNomeModal(true);
                    }
                })
                .catch((err) => {
                    if (axios.isCancel(err)) return;
                    setPessoa(null);
                    setData('nome', '');
                    setData('matricula', '');
                    setData('email', '');
                    setShowNomeInput(true);
                    setShowNomeModal(true);
                    setLookupError('Não foi possível consultar o CPF no momento.');
                })
                .finally(() => setBuscando(false));

            return () => controller.abort();
        } else {
            setPessoa(null);
            setData('nome', '');
            setData('matricula', '');
            setData('email', '');
            setShowNomeInput(false);
            setLookupError(null);
        }
    }, [data.cpf, step]);

    const submit = (e) => {
        e.preventDefault();

        if (step === 2 && showNomeInput) {
            if (!isNomeCompletoValido(data.nome)) {
                alert('Por favor, informe seu nome completo (ex.: "Leonardo Augusto").');
                return;
            }
        }

        post(route('senhas.store'));
    };

    return (
        <>
            <Head title="Criar Senha" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-4 px-4">
                <img
                    src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                    alt="Logo Prevmoc"
                    className='h-14 bg-white rounded-full p-1 mb-2 object-contain'
                />
                <div className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
                    <div className="relative p-6">
                        <div className="absolute left-8 right-8 top-1/2 -z-10 h-1 mt-10 bg-white/30 rounded-full" />
                        <div
                            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 mt-10 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500"
                            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                        />
                        <div className="flex justify-between">
                            {steps.map((s, i) => (
                                <div key={s} className="flex flex-col items-center gap-2">
                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${i <= step
                                            ? 'border-white bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg'
                                            : 'border-white/40 bg-white/20 text-white/60'
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className={`text-xs md:text-sm ${i <= step ? 'text-white' : 'text-white/60'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-8 py-2 text-center space-y-8">
                        {step === 0 && (
                            <div className="py-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div className="text-left space-y-4 px-4">
                                        <div>
                                            <p className="text-5xl lg:text-5xl font-extrabold text-white leading-tight text-center">Bem-vindo ao</p>
                                            <p className="text-5xl lg:text-7xl font-extrabold text-white leading-tight text-center">ATENDE AÍ</p>
                                            <p className="text-5xl lg:text-5xl font-extrabold text-white leading-tight text-center">PREVMOC!</p>
                                        </div>

                                        <p className="text-lg text-white/90">
                                            Nosso sistema para gerar senhas de atendimento de forma rápida e prática.
                                        </p>

                                        <div className="space-y-4 text-white/90 text-lg">
                                            <p className="text-xl font-semibold text-white">
                                                Como funciona:
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                        1
                                                    </span>
                                                    <p className="pt-1">
                                                        Clique no botão <strong>"Iniciar Atendimento"</strong>
                                                    </p>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                        2
                                                    </span>
                                                    <p className="pt-1">
                                                        Escolha o serviço que você precisa
                                                    </p>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                        3
                                                    </span>
                                                    <p className="pt-1">
                                                        Digite seu CPF
                                                    </p>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                        4
                                                    </span>
                                                    <p className="pt-1">
                                                        Pronto! Sua senha será gerada
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 ">
                                            <Link
                                                href={route('senhas.perguntas-frequentes')}
                                                className="inline-flex items-center gap-2 text-lg font-medium text-teal-100 hover:text-white hover:underline transition"
                                            >
                                                <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Perguntas Frequentes
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center px-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full max-w-sm py-8 px-6 rounded-2xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-2xl hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <span>Iniciar Atendimento</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="py-2">
                                <div className="flex flex-col h-full max-h-[70vh]">
                                    <div className="text-center space-y-3 px-4 mb-6">
                                        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                            Escolha o Serviço
                                        </h2>
                                        <div className="flex flex-col md:flex-row md:items-stretch">
                                            <p className="text-lg max-w-md text-white/90 mx-auto">
                                                Selecione abaixo qual tipo de atendimento você precisa hoje.
                                            </p>

                                            <div className="hidden md:block self-stretch w-px bg-white/80 mx-6" />

                                            <p className="text-lg max-w-md text-white/90 mx-auto">
                                                Se você não sabe qual serviço escolher, nossa equipe pode ajudá-lo no balcão de informações.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10 hover:scrollbar-thumb-white/50">
                                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                            {tipoAtendimentos.map((tipo, index) => (
                                                <motion.button
                                                    key={tipo.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => {
                                                        setData('tipo_atendimento_id', tipo.id);
                                                        setStep(2);
                                                    }}
                                                    className="group relative overflow-hidden rounded-xl bg-white/15 backdrop-blur-md p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/25 ring-1 ring-white/20 hover:ring-white/40 min-h-[140px] flex flex-col items-center justify-center"
                                                >
                                                    <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-300 text-white shadow-lg group-hover:scale-110 transition-transform">
                                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                        </svg>
                                                    </div>

                                                    <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
                                                        {tipo.nome}
                                                    </h3>
                                                    <div className="flex gap-2 items-center text-white/80 text-sm">Clique para selecionar <CursorArrowRaysIcon className="h-5 w-5 text-white" /></div>

                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4 px-4">
                                        <div className="text-center">
                                            <p className="text-white/80 text-sm">
                                                💡 <strong>Dica:</strong> Role para ver mais serviços se necessário
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                onClick={() => setStep(0)}
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                                Voltar ao Início
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={submit} className="space-y-8 py-4">
                                <h2 className="text-3xl font-bold text-white">Informe seu CPF abaixo</h2>

                                <div className="text-4xl font-mono text-white tracking-[0.4rem]">
                                    {data.cpf.padEnd(11, '•')}
                                </div>
                                {errors.cpf && <p className="text-red-300 text-sm">{errors.cpf}</p>}

                                <LoadingModal open={buscando} message="Consultando CPF…" />
                                {lookupError && <p className="text-sm text-yellow-200">{lookupError}</p>}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                    <div className="flex items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            {pessoa && pessoa.NOME && !showNomeInput ? (
                                                <motion.div
                                                    key="pessoaEncontrada"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full"
                                                >
                                                    <div className="rounded-xl bg-white/15 backdrop-blur p-6 text-left text-white">
                                                        <p className="text-sm opacity-80 mb-2">✓ Encontramos um cadastro:</p>
                                                        <p className="text-xl font-bold mb-3">{pessoa.NOME}</p>
                                                        <div className="mt-3 space-y-1 text-sm opacity-90">
                                                            {pessoa.MATRICULA && (
                                                                <p>
                                                                    <span className="font-medium">Matrícula:</span> {pessoa.MATRICULA}
                                                                </p>
                                                            )}
                                                            {pessoa.EMAIL && (
                                                                <p>
                                                                    <span className="font-medium">E-mail:</span> {String(pessoa.EMAIL).toLowerCase()}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowNomeModal(true);
                                                                setTempNome("");
                                                            }}
                                                            className="mt-4 text-sm underline underline-offset-4 opacity-80 hover:opacity-100 transition"
                                                        >
                                                            Não sou eu / digitar outro nome
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : showNomeInput && data.nome ? (
                                                <motion.div
                                                    key="nomeDigitado"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full"
                                                >
                                                    <div className="rounded-xl bg-white/15 backdrop-blur p-6 text-left text-white">
                                                        <p className="text-sm opacity-80 mb-2">✓ Nome informado:</p>
                                                        <p className="text-xl font-bold ">{data.nome}</p>
                                                        <p className="text-xl font-bold ">{data.cpf}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowNomeModal(true);
                                                                setTempNome(data.nome);
                                                            }}
                                                            className="mt-3 text-sm underline underline-offset-4 opacity-80 hover:opacity-100 transition"
                                                        >
                                                            Alterar nome
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="aguardando"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="w-full"
                                                >
                                                    <div className="rounded-xl bg-white/10 backdrop-blur p-6 text-center flex flex-col items-center text-white">
                                                        <UserIcon className="h-14 w-14 text-white" />
                                                        <p className="text-lg">Digite seu CPF completo</p>
                                                        <p className=" mt-1 opacity-75">para verificar seus dados</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                            <button
                                                type="button"
                                                key={n}
                                                onClick={() => handleDigit(n.toString())}
                                                className="py-6 rounded-xl text-2xl font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all hover:scale-105"
                                            >
                                                {n}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleBackspace}
                                            className="py-6 rounded-xl text-xl font-semibold bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30 backdrop-blur-md transition-all hover:scale-105"
                                        >
                                            ⌫
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDigit('0')}
                                            className="py-6 rounded-xl text-2xl font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all hover:scale-105"
                                        >
                                            0
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="py-6 rounded-xl text-xl font-semibold bg-red-500/20 text-red-100 hover:bg-red-500/30 backdrop-blur-md transition-all hover:scale-105"
                                        >
                                            C
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            data.cpf.length < 11 ||
                                            buscando ||
                                            (showNomeInput && !data.nome)
                                        }
                                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-semibold disabled:opacity-40 hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                    >
                                        {processing ? 'Gerando Senha…' : 'Gerar Senha'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showNomeModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => {
                                setShowNomeModal(false);
                                setTempNome('');
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl ring-1 ring-gray-200"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            Informe seu nome
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNomeModal(false);
                                                setTempNome('');
                                            }}
                                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">
                                        Não encontramos seu CPF em nosso sistema. Por favor, digite seu nome completo para continuar.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="modal-nome" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nome completo
                                            </label>
                                            <input
                                                id="modal-nome"
                                                type="text"
                                                value={tempNome}
                                                onChange={(e) => setTempNome(e.target.value)}
                                                placeholder="Ex: Leonardo Augusto da Silva"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && tempNome.trim()) {
                                                        if (!isNomeCompletoValido(tempNome)) {
                                                            alert('Por favor, informe seu nome completo (ex.: "Leonardo Augusto").');
                                                            return;
                                                        }
                                                        setData('nome', tempNome);
                                                        setData('matricula', '');
                                                        setData('email', '');
                                                        setShowNomeInput(true);
                                                        setShowNomeModal(false);
                                                        setTempNome('');
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNomeModal(false);
                                                    setTempNome('');
                                                }}
                                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!tempNome.trim()) {
                                                        alert('Por favor, digite seu nome.');
                                                        return;
                                                    }
                                                    if (!isNomeCompletoValido(tempNome)) {
                                                        alert('Por favor, informe seu nome completo (ex.: "Leonardo Augusto").');
                                                        return;
                                                    }
                                                    setData('nome', tempNome);
                                                    setData('matricula', '');
                                                    setData('email', '');
                                                    setShowNomeInput(true);
                                                    setShowNomeModal(false);
                                                    setTempNome('');
                                                }}
                                                disabled={!tempNome.trim()}
                                                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-semibold hover:from-cyan-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
