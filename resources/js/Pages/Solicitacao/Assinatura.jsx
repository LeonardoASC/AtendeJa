import React, { useRef, useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PencilSquareIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Assinatura({ dadosSolicitacao, tipoAtendimento }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [context, setContext] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        ...dadosSolicitacao,
        assinatura: '',
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        setContext(ctx);
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1e293b';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const { x, y } = getCoordinates(e);

        setIsDrawing(true);
        setHasDrawn(true);

        if (context) {
            context.beginPath();
            context.moveTo(x, y);
        }
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing || !context) return;

        const { x, y } = getCoordinates(e);
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(false);
    };

    const clearSignature = () => {
        if (!context || !canvasRef.current) return;

        const canvas = canvasRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        setHasDrawn(false);
        setData('assinatura', '');
    };

    const [shouldSubmit, setShouldSubmit] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!hasDrawn) {
            alert('Por favor, assine no campo acima antes de continuar.');
            return;
        }

        const canvas = canvasRef.current;
        const signatureData = canvas.toDataURL('image/png');
        setData('assinatura', signatureData);
        setShouldSubmit(true);
    };

    useEffect(() => {
        if (shouldSubmit && data.assinatura) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value) || typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value ?? '');
                }
            });
            post(route('solicitacoes.assinar.store'), formData, {
                forceFormData: true,
                onFinish: () => setShouldSubmit(false),
            });
        }
    }, [shouldSubmit, data.assinatura]);

    return (
        <>
            <Head title="Assinatura - Solicitação" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <div className="text-center space-y-4 mb-8">
                            <div className="flex justify-center">
                                <div className="p-4 rounded-full bg-gradient-to-br from-cyan-400 to-teal-300 shadow-lg">
                                    <PencilSquareIcon className="h-16 w-16 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                Assine sua Solicitação
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                {tipoAtendimento?.nome}
                            </p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/20 mb-6">
                            <h2 className="text-lg font-bold text-white mb-3">Resumo da Solicitação</h2>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-white/70">Nome:</span>
                                    <p className="text-white font-medium">{dadosSolicitacao.nome}</p>
                                </div>
                                <div>
                                    <span className="text-white/70">CPF:</span>
                                    <p className="text-white font-medium">{dadosSolicitacao.cpf}</p>
                                </div>
                                {dadosSolicitacao.email && (
                                    <div className="col-span-2">
                                        <span className="text-white/70">E-mail:</span>
                                        <p className="text-white font-medium">{dadosSolicitacao.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 ring-1 ring-white/20 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <PencilSquareIcon className="h-7 w-7" />
                                        Assinatura Digital
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all ring-1 ring-white/20"
                                    >
                                        <ArrowPathIcon className="h-5 w-5" />
                                        Limpar
                                    </button>
                                </div>

                                <p className="text-white/90 text-sm">
                                    Use o dedo ou caneta stylus para assinar na área abaixo
                                </p>

                                <div className="relative">
                                    <canvas
                                        ref={canvasRef}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                        className="w-full h-64 md:h-80 bg-white rounded-xl border-4 border-dashed border-white/30 cursor-crosshair touch-none"
                                        style={{ touchAction: 'none' }}
                                    />
                                    {!hasDrawn && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <p className="text-gray-400 text-lg font-medium">
                                                Assine aqui
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border-l-4 border-yellow-400">
                                    <p className="text-yellow-100 text-sm flex items-start gap-2">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>
                                            Ao assinar, você concorda com os termos e confirma que as informações fornecidas são verdadeiras.
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {errors.assinatura && (
                                <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 ring-1 ring-red-400/30">
                                    <p className="text-white text-center">{errors.assinatura}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                    className="flex-1 py-4 px-6 rounded-xl text-lg font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all hover:scale-105 text-center border-2 border-white/30 disabled:opacity-50"
                                >
                                    Voltar
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing || !hasDrawn}
                                    className="flex-1 py-4 px-6 rounded-xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-lg hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {processing ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            <CheckCircleIcon className="h-6 w-6" />
                                            Confirmar e Enviar
                                        </span>
                                    )}
                                </button>
                            </div>

                            <p className="text-white/70 text-sm text-center">
                                Certifique-se de que sua assinatura está legível
                            </p>
                        </form>
                    </div>
                </motion.div>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <img
                        src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                        alt="Logo Prevmoc"
                        className="h-12 bg-white rounded-full p-1 object-contain"
                    />
                    <p className="text-white/80 text-sm">PREVMOC - Instituto de Previdência dos Servidores de Montes Claros</p>
                </div>
            </div>
        </>
    );
}
