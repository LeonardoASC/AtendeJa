import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head, Link, useForm } from '@inertiajs/react';
import LoadingModal from '@/Components/LoadingModal';
import { motion, AnimatePresence } from "framer-motion";

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
                    }
                })
                .catch((err) => {
                    if (axios.isCancel(err)) return;
                    setPessoa(null);
                    setData('nome', '');
                    setData('matricula', '');
                    setData('email', '');
                    setShowNomeInput(true);
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-10 px-4">
                <div className="relative w-full max-w-2xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
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

                    <div className="p-8 md:p-12 text-center space-y-8">
                        {step === 0 && (
                            <div className="space-y-8">
                                <h1 className="text-4xl font-extrabold tracking-tight text-white">Bem-vindo!</h1>
                                <p className="text-lg text-white/90">Clique no botão abaixo para gerar sua senha de atendimento.</p>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 font-semibold text-white text-xl hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    Iniciar
                                </button>
                                <Link href={route('senhas.perguntas-frequentes')} className="inline-block font-medium text-teal-100 hover:underline">
                                    Perguntas Frequentes
                                </Link>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Selecione o serviço</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {tipoAtendimentos.map((tipo) => (
                                        <button
                                            key={tipo.id}
                                            onClick={() => {
                                                setData('tipo_atendimento_id', tipo.id);
                                                setStep(2);
                                            }}
                                            className="py-4 px-3 rounded-xl bg-white/10 text-white/90 hover:bg-white/20 backdrop-blur-md shadow-lg"
                                        >
                                            {tipo.nome}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep(0)}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition"
                                >
                                    Voltar
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={submit} className="space-y-8">
                                <h2 className="text-3xl font-bold text-white">Digite seu CPF</h2>

                                <div className="text-4xl font-mono text-white tracking-[0.4rem]">
                                    {data.cpf.padEnd(11, '•')}
                                </div>
                                {errors.cpf && <p className="text-red-300 text-sm">{errors.cpf}</p>}


                                <LoadingModal open={buscando} message="Consultando CPF…" />
                                {lookupError && <p className="text-sm text-yellow-200">{lookupError}</p>}

                                <AnimatePresence mode="wait">
                                    {(pessoa && pessoa.NOME && !showNomeInput) || showNomeInput ? (
                                        <motion.div
                                            key={showNomeInput ? "nomeInput" : "pessoaEncontrada"}
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: "auto" }}
                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            {pessoa && pessoa.NOME && !showNomeInput ? (
                                                <div className="rounded-xl bg-white/15 backdrop-blur p-4 text-left text-white">
                                                    <p className="text-sm opacity-80 mb-1">Encontramos um cadastro:</p>
                                                    <p className="text-lg font-semibold">{pessoa.NOME}</p>
                                                    <div className="mt-2 text-xs opacity-80">
                                                        {pessoa.MATRICULA && <span>Matrícula: {pessoa.MATRICULA}</span>}
                                                        {pessoa.EMAIL && (
                                                            <span className="ml-3">
                                                                E-mail: {String(pessoa.EMAIL).toLowerCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowNomeInput(true);
                                                            setData("nome", "");
                                                            setData("matricula", "");
                                                            setData("email", "");
                                                        }}
                                                        className="mt-3 text-xs underline underline-offset-4 opacity-80 hover:opacity-100"
                                                    >
                                                        Não sou eu / digitar outro nome
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="rounded-xl bg-white/15 backdrop-blur p-4 text-left text-white">
                                                    <label htmlFor="nome" className="block text-teal-100 mb-1">
                                                        Nome completo
                                                    </label>
                                                    <input
                                                        id="nome"
                                                        name="nome"
                                                        value={data.nome}
                                                        onChange={(e) => setData("nome", e.target.value)}
                                                        placeholder="Digite seu nome completo"
                                                        className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>


                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                        <button
                                            type="button"
                                            key={n}
                                            onClick={() => handleDigit(n.toString())}
                                            className="py-6 rounded-xl text-2xl font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                                        >
                                            {n}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleBackspace}
                                        className="py-6 rounded-xl text-xl font-semibold bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30 backdrop-blur-md"
                                    >
                                        ⌫
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDigit('0')}
                                        className="py-6 rounded-xl text-2xl font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                                    >
                                        0
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="py-6 rounded-xl text-xl font-semibold bg-red-500/20 text-red-100 hover:bg-red-500/30 backdrop-blur-md"
                                    >
                                        C
                                    </button>
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
            </div>
        </>
    );
}
