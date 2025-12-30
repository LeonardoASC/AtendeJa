import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    DocumentTextIcon,
    IdentificationIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import LoadingModal from '@/Components/LoadingModal';

export default function Formulario({ tipoAtendimento }) {
    const [buscando, setBuscando] = useState(false);
    const [lookupError, setLookupError] = useState(null);
    const [pessoa, setPessoa] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        tipo_atendimento_id: tipoAtendimento.id,
        nome: '',
        cpf: '',
        email: '',
        matricula: '',
        telefone: '',
        dados_formulario: {},
    });

    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.slice(0, 11);
    };

    const formatCPFDisplay = (cpf) => {
        if (!cpf) return '';
        const numbers = cpf.replace(/\D/g, '');
        if (numbers.length !== 11) return cpf;
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    useEffect(() => {
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
                        setData({
                            ...data,
                            nome: first.NOME || '',
                            matricula: first.MATRICULA || '',
                            email: first.EMAIL ? String(first.EMAIL).toLowerCase() : '',
                        });
                    } else {
                        setPessoa(null);
                        setLookupError('CPF não encontrado no sistema. Não é possível fazer a solicitação.');
                    }
                })
                .catch((err) => {
                    if (axios.isCancel(err)) return;
                    setPessoa(null);
                    setLookupError('Não foi possível consultar o CPF no momento.');
                })
                .finally(() => setBuscando(false));

            return () => controller.abort();
        } else {
            setPessoa(null);
            setLookupError(null);
        }
    }, [data.cpf]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!pessoa) {
            setLookupError('CPF não encontrado no sistema. Não é possível fazer a solicitação.');
            return;
        }

        post(route('solicitacoes.formulario.store'));
    };

    return (
        <>
            <Head title={`Solicitação - ${tipoAtendimento.nome}`} />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-5xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:px-12">
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="text-left space-y-4 px-4">
                                    <div>
                                        <p className="text-4xl lg:text-4xl font-extrabold text-white leading-tight text-center">Preencha o</p>
                                        <p className="text-4xl lg:text-5xl font-extrabold text-white leading-tight text-center">FORMULÁRIO</p>
                                        <div className='flex items-center justify-center gap-4'>
                                            <p className="text-4xl lg:text-4xl font-extrabold text-white leading-tight text-center">AGORA!</p>
                                            <img
                                                src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                                alt="Logo Prevmoc"
                                                className='h-14 bg-white rounded-full p-1 mb-2 object-contain'
                                            />
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/90">
                                        Complete suas informações para prosseguir com a solicitação.
                                    </p>

                                    <div className="space-y-1 text-white/90 text-lg">
                                        <p className="text-xl font-semibold text-white">
                                            Como preencher:
                                        </p>

                                        <div className="space-y-1">
                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    1
                                                </span>
                                                <p className="pt-1">
                                                    Digite seu CPF para buscar seus dados automaticamente
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    2
                                                </span>
                                                <p className="pt-1">
                                                    Verifique se os dados estão corretos
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold">
                                                    3
                                                </span>
                                                <p className="pt-1">
                                                    Clique em "Enviar Solicitação" para continuar
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="text-white/90">
                                            <p className="font-semibold mb-2">Dicas importantes:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Digite apenas os números do CPF</li>
                                                <li>• Verifique se todos os dados estão corretos</li>
                                                <li>• Tenha seus documentos em mãos</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 items-center justify-center px-4">
                                    <div className="w-full max-w-lg">

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/20 space-y-4">
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    <UserIcon className="h-6 w-6" />
                                                    Informe seus dados abaixo
                                                </h3>

                                                <div>
                                                    <label htmlFor="cpf" className="block text-white font-semibold mb-1">
                                                        CPF *
                                                    </label>
                                                    <input
                                                        id="cpf"
                                                        type="text"
                                                        value={data.cpf}
                                                        onChange={(e) => setData('cpf', formatCPF(e.target.value))}
                                                        className="w-full px-4 py-2 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                                                        placeholder="Digite apenas os números do CPF"
                                                        maxLength={11}
                                                        required
                                                    />
                                                    {errors.cpf && <p className="mt-1 text-sm text-red-300">{errors.cpf}</p>}
                                                    {lookupError && <p className="mt-1 text-sm text-red-300">{lookupError}</p>}
                                                </div>

                                                {pessoa && (
                                                    <div className="mt-6 space-y-4">
                                                        <div className="p-2 bg-green-500/20 backdrop-blur-md rounded-lg border border-green-400/30">
                                                            <p className="text-green-100 flex items-center gap-2 font-semibold">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                CPF encontrado no sistema!
                                                            </p>
                                                        </div>

                                                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 ring-1 ring-white/20 space-y-3">
                                                            <div className="grid grid-cols-1 gap-1">
                                                                <div>
                                                                    <p className="text-white/70 text-sm font-medium  flex items-center ">
                                                                        <IdentificationIcon className="h-4 w-4" />
                                                                        CPF
                                                                    </p>
                                                                    <p className="text-white text-lg font-semibold">{formatCPFDisplay(pessoa.CPF || data.cpf)}</p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-white/70 text-sm font-medium  flex items-center gap-2">
                                                                        <UserIcon className="h-4 w-4" />
                                                                        Nome Completo
                                                                    </p>
                                                                    <p className="text-white text-lg font-semibold">{pessoa.NOME || 'Não informado'}</p>
                                                                </div>

                                                                {pessoa.MATRICULA && (
                                                                    <div>
                                                                        <p className="text-white/70 text-sm font-medium ">Matrícula</p>
                                                                        <p className="text-white text-lg font-semibold">{pessoa.MATRICULA}</p>
                                                                    </div>
                                                                )}

                                                                {pessoa.EMAIL && (
                                                                    <div>
                                                                        <p className="text-white/70 text-sm font-medium  flex items-center gap-2">
                                                                            <EnvelopeIcon className="h-4 w-4" />
                                                                            E-mail
                                                                        </p>
                                                                        <p className="text-white text-lg font-semibold">{String(pessoa.EMAIL).toLowerCase()}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {errors.error && (
                                                    <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 ring-1 ring-red-400/30">
                                                        <p className="text-white text-center">{errors.error}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-4 pt-1">
                                                    <Link
                                                        href={route('solicitacoes.index')}
                                                        className="py-3 px-6 rounded-xl text-base font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all hover:scale-105 text-center border-2 border-white/30"
                                                    >
                                                        Voltar
                                                    </Link>

                                                    <button
                                                        type="submit"
                                                        disabled={processing || buscando || !pessoa}
                                                        className="py-3 px-6 rounded-xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-lg hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                    >
                                                        {processing ? 'Enviando...' : 'Enviar Solicitação'}
                                                    </button>
                                                </div>

                                                <p className="text-white/70 text-sm text-center">
                                                    * Campos obrigatórios
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <LoadingModal open={buscando} message="Consultando CPF…" />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
