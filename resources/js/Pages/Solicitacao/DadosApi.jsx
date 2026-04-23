import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import SolicitacaoApiDataFields from '@/Components/SolicitacaoApiDataFields';

export default function DadosApi({ dadosSolicitacao, tipoAtendimento }) {
    const { post, processing, setData } = useForm({
        recadastramento: {
            alteracoesCampos: [],
            novosDependentes: [],
            dependentesParaRemover: [],
            resumo: {
                totalCamposAlterados: 0,
                totalNovosDependentes: 0,
                totalDependentesParaRemover: 0,
            },
        },
    });

    const handleContinuar = (e) => {
        e.preventDefault();
        post(route('solicitacoes.dados-api.store'));
    };

    return (
        <>
            <Head title="Revisao dos Dados da API" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-6xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="px-8 py-4">
                        <div className="flex items-center justify-center">
                            <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl py-3 px-5 ring-1 ring-white/20 ">
                                <h2 className="text-lg font-bold text-white mb-3">Resumo da Solicitacao</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-center">
                                    <div>
                                        <span className="text-white/70">Nome:</span>
                                        <p className="text-white font-medium">{dadosSolicitacao?.nome || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70">CPF:</span>
                                        <p className="text-white font-medium">{dadosSolicitacao?.cpf || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70">Matricula:</span>
                                        <p className="text-white font-medium">{dadosSolicitacao?.matricula || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-white/70 ">Tipo de Atendimento:</span>
                                        <p className="text-white font-medium capitalize">{tipoAtendimento?.nome || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SolicitacaoApiDataFields
                            dadosFormulario={dadosSolicitacao?.dados_formulario || {}}
                            onReviewDataChange={(payload) => setData('recadastramento', payload)}
                        />

                        <form onSubmit={handleContinuar} className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Link
                                href={route('solicitacoes.create', { tipo: dadosSolicitacao?.tipo_atendimento_id })}
                                className="py-3 px-6 rounded-xl text-base font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all text-center border-2 border-white/30"
                            >
                                Voltar ao formulario
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="py-3 px-6 rounded-xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-lg hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Continuando...' : 'Continuar para Assinatura'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
