// resources/js/Pages/Autenticado/Relatorios/Index.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function Relatorios() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-100">
                    Relatórios
                </h2>
            }
        >
            <Head title="Relatórios" />

            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <section className="mb-10 max-w-3xl text-gray-300">
                        <p className="text-lg">
                            A seção abaixo disponibiliza relatórios gerenciais em&nbsp;PDF.
                            Utilize-os para análises de desempenho, auditoria e prestação de
                            contas.
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Dados consolidados de senhas atendidas.</li>
                            <li>Timestamps para rastreabilidade completa.</li>
                            <li>Formato pronto para impressão ou compartilhamento.</li>
                        </ul>
                    </section>

                    <div className="group relative rounded-2xl p-px transition-shadow hover:shadow-2xl max-w-md">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 opacity-20 group-hover:opacity-40" />
                        <div className="relative rounded-[inherit] bg-white/20 backdrop-blur-md p-8 flex flex-col items-start gap-6 text-gray-100">
                            <div className="flex items-center gap-3">
                                <DocumentArrowDownIcon className="h-9 w-9 text-teal-200" />
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Relatório de Senhas
                                    </h3>
                                    <p className="text-sm text-gray-200">
                                        Exportação diária completas das senhas atendidas.
                                    </p>
                                </div>
                            </div>

                            <a
                                href={route('relatorios.senhas.pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/button relative inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-500"
                            >
                                <DocumentArrowDownIcon className="h-5 w-5" />
                                Baixar PDF
                                <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/button:opacity-10" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
