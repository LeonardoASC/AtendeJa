import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { PrinterIcon, QrCodeIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ImpressaoTicket from '@/Pages/Senha/Partials/ImpressaoTicket';
import { renderToStaticMarkup } from 'react-dom/server';

export default function Show({ senha }) {
    const [step] = useState(3);
    const [showQR, setShowQR] = useState(false);
    const steps = ['Início', 'Serviço', 'CPF', 'Concluído'];
    const maskCpf = cpf => (cpf?.toString().replace(/\D/g, '').replace(/^(\d{3})\d{6}(\d{2})$/, '$1.***.***-$2')) || '***';

    const qrUrl = route('senhas.ticket-virtual', { token: senha.public_token });

    const handlePrint = () => {
        const html = renderToStaticMarkup(
            <ImpressaoTicket
                codigo={senha.codigo}
                tipo={senha.tipo}
                cpf={senha.cpf}
                created_at={senha.created_at}
            />
        );
        const win = window.open('', '_blank', 'width=360,height=640');
        win.document.write('<!DOCTYPE html>' + html);
        win.document.close();
    };

    return (
        <>
            <Head title="Senha Gerada" />
            <style>{`
                @keyframes popIn {
                  0%   { opacity: 0; transform: scale(.8) translateY(20px); }
                  100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>

            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 p-6">
                <div className="h-20 w-20 mb-10  bg-white rounded-full p-2 flex items-center justify-center font-bold text-blue-600">
                    <img src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png" alt="Logo Prevmoc" />
                </div>
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
                                    <span className={`text-xs md:text-sm ${i <= step ? 'text-white' : 'text-white/60'}`}>
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 py-10 md:p-12 text-center">
                        <h2 className="mb-4 text-4xl font-extrabold text-white">Senha gerada!</h2>

                        <div className="space-y-3 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-inner text-white">
                            <p className="text-4xl font-black tracking-widest">{senha.codigo}</p>
                            <p className="text-lg">
                                <span className="font-semibold">Serviço: </span>
                                {senha.tipo}
                            </p>
                            <p className="text-lg">
                                <span className="font-semibold">CPF: </span>
                                {maskCpf(senha.cpf)}
                            </p>
                        </div>

                        <div className="mt-8 mb-4 flex flex-col items-center gap-2">
                            <p className="text-sm text-white/90">
                                <span className="font-semibold">Dica sustentável:</span> Prefira usar o QR Code
                                para ter seu ticket virtual no celular. Assim você ajuda a reduzir o consumo de papel
                                e a preservar o planeta. 🌱
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col flex-wrap justify-center gap-4">
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowQR(!showQR)}
                                    className="flex items-center gap-2 px-16 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 font-semibold text-white text-base hover:from-teal-600 hover:to-cyan-700 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    <QrCodeIcon className="h-5 w-5" />
                                    Acessar Ticket Virtual
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 font-semibold text-white text-base hover:from-indigo-700 hover:to-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                                >
                                    <PrinterIcon className="h-5 w-5" />
                                    Imprimir Ticket
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.visit(route('senhas.index'))}
                                className="flex drop-shadow-xl items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white font-semibold text-cyan-600 text-base hover:from-cyan-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white/40"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                                Nova senha
                            </button>
                        </div>

                        {showQR && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div
                                    className="relative bg-gradient-to-br from-neutral-700 via-neutral-900 to-black
                                   rounded-2xl py-6 px-10 shadow-xl text-center
                                   animate-[popIn_0.25s_ease-out_forwards]"
                                >
                                    <button
                                        onClick={() => setShowQR(false)}
                                        className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow hover:bg-gray-200"
                                        aria-label="Fechar"
                                    >
                                        <XMarkIcon className="h-4 w-4 text-gray-700" />
                                    </button>

                                    <h3 className="mb-4 text-lg font-semibold text-white">Seu ticket virtual</h3>
                                    <QRCodeSVG value={qrUrl} size={220} fgColor="#ffffff" bgColor="transparent" />

                                    <p className="mt-4 text-xs text-gray-300 max-w-[220px] mx-auto">
                                        Aponte a câmera para o código para abrir seu ticket no celular 🌱
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
