import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ tipoAtendimentos }) {
    const [step, setStep] = useState(0);
    const [senhaGerada, setSenhaGerada] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_atendimento_id: '',
        cpf: '',
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo) {
            const channel = window.Echo.channel('senhas.novas').listen('.SenhaCriada',
                (event) => {
                    if (event?.senha?.codigo && step === 2) {
                        setSenhaGerada({
                            tipo:
                                tipoAtendimentos.find(
                                    (t) => t.id === event.senha.tipo_atendimento_id,
                                )?.nome ?? 'Desconhecido',
                            cpf: event.senha.cpf,
                            codigo: event.senha.codigo,
                        });
                        setStep(3);
                    }
                },
            );
            return () => window.Echo.leave('senhas.novas');
        }
    }, [step, tipoAtendimentos]);

    const steps = ['Início', 'Serviço', 'CPF', 'Concluído'];

    const handleDigit = (d) =>
        data.cpf.length < 11 && setData('cpf', data.cpf + d);
    const handleBackspace = () =>
        setData('cpf', data.cpf.slice(0, -1));
    const handleClear = () => setData('cpf', '');
    const handleRestart = () => {
        reset();
        setSenhaGerada(null);
        setStep(0);
    };
    const submit = (e) => {
        e.preventDefault();
        post(route('senhas.store'));
    };


    return (
        <>
            <Head title="Criar Senha" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-10 px-4">
                <div className="relative w-full max-w-2xl rounded-3xl bg-white/20 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden">
                    <div className="relative p-6">
                        <div className="absolute left-8 right-8 top-1/2 -z-10 h-1 mt-10 bg-white/30 rounded-full" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1 mt-10 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-500"
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
                                    <span className={`text-xs md:text-sm ${i <= step ? 'text-white' : 'text-white/60'}`}>
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 md:p-12 text-center space-y-8">
                        {step === 0 && (
                            <div className="space-y-8">
                                <h1 className="text-4xl font-extrabold tracking-tight text-white">
                                    Bem-vindo!
                                </h1>
                                <p className="text-lg text-white/90">
                                    Clique no botão abaixo para gerar sua
                                    senha de atendimento.
                                </p>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 font-semibold text-white text-xl hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    Iniciar
                                </button>
                                <Link
                                    href={route('senhas.perguntas-frequentes')}
                                    className="inline-block font-medium text-teal-100 hover:underline"
                                >
                                    Perguntas Frequentes
                                </Link>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">
                                    Selecione o serviço
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {tipoAtendimentos.map((tipo) => (
                                        <button key={tipo.id}
                                            onClick={() => {
                                                setData(
                                                    'tipo_atendimento_id',
                                                    tipo.id,
                                                );
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
                                <h2 className="text-3xl font-bold text-white">
                                    Digite seu CPF
                                </h2>

                                <div className="text-4xl font-mono text-white tracking-[0.4rem]">
                                    {data.cpf.padEnd(11, '•')}
                                </div>
                                {errors.cpf && (
                                    <p className="text-red-300 text-sm">
                                        {errors.cpf}
                                    </p>
                                )}

                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                                        (n) => (
                                            <button
                                                type="button"
                                                key={n}
                                                onClick={() =>
                                                    handleDigit(
                                                        n.toString(),
                                                    )
                                                }
                                                className="py-6 rounded-xl text-2xl font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                                            >
                                                {n}
                                            </button>
                                        ),
                                    )}
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
                                            processing || data.cpf.length < 11
                                        }
                                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-semibold disabled:opacity-40 hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                    >
                                        {processing
                                            ? 'Enviando…'
                                            : 'Gerar Senha'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && senhaGerada && (
                            <div className="space-y-8">
                                <h2 className="text-4xl font-extrabold text-emerald-300">
                                    Senha Gerada!
                                </h2>
                                <div className="space-y-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-inner text-white">
                                    <p className="text-lg">
                                        <span className="font-semibold">
                                            Serviço:
                                        </span>{' '}
                                        {senhaGerada.tipo}
                                    </p>
                                    <p className="text-lg">
                                        <span className="font-semibold">
                                            CPF:
                                        </span>{' '}
                                        {senhaGerada.cpf}
                                    </p>
                                    <p className="text-4xl font-black tracking-widest">
                                        {senhaGerada.codigo}
                                    </p>
                                </div>
                                <button
                                    onClick={handleRestart}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 font-semibold text-white text-xl hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    Gerar Nova Senha
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
