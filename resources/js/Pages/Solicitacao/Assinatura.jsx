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
                    className="relative w-full max-w-7xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-4 md:px-6">
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                                <div className="text-left space-y-4 px-4">
                                    <div>
                                        <p className="text-2xl lg:text-2xl font-extrabold text-white leading-tight text-center">Assine sua</p>
                                        <p className="text-2xl lg:text-3xl font-extrabold text-white leading-tight text-center">SOLICITAÇÃO</p>
                                        <div className='flex items-center justify-center gap-4'>
                                            <p className="text-2xl lg:text-2xl font-extrabold text-white leading-tight text-center">ABAIXO!</p>
                                            <img
                                                src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                                alt="Logo Prevmoc"
                                                className='h-8 bg-white rounded-full p-1 mb-2 object-contain'
                                            />
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/90">
                                        Confirme sua solicitação com uma assinatura digital.
                                    </p>

                                    <div className="space-y-4 text-white/90 text-lg">
                                        <div className="">
                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white font-bold">
                                                    1
                                                </span>
                                                <p className="">
                                                    Use o dedo ou caneta stylus para assinar
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white font-bold">
                                                    2
                                                </span>
                                                <p className="">
                                                    Certifique-se de que a assinatura está legível
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white font-bold">
                                                    3
                                                </span>
                                                <p className="">
                                                    Clique em "Confirmar e Enviar" para finalizar
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 px-4">
                                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/20">
                                        <h3 className="text-lg font-bold text-white mb-3">Resumo da Solicitação</h3>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div>
                                                <span className="text-white/70">Nome:</span>
                                                <p className="text-white font-medium">{dadosSolicitacao.nome}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <span className="text-white/70">CPF:</span>
                                                    <p className="text-white font-medium">{dadosSolicitacao.cpf}</p>
                                                </div>
                                                <div>
                                                    <span className="text-white/70">Matrícula:</span>
                                                    <p className="text-white font-medium">{dadosSolicitacao.matricula}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-white/70">Tipo de Atendimento:</span>
                                                <p className="text-white font-medium">{tipoAtendimento.nome}</p>
                                            </div>

                                                                                        <div className='flex items-center justify-between '>
                                                <div className='flex flex-col w-full'>
                                                    <span className="text-white/70 ">E-mail:</span>
                                                    <p className="text-white font-medium">{dadosSolicitacao.email || 'Email Não Cadastrado.'}</p>
                                                </div>
                                                {dadosSolicitacao.email === null && (
                                                    <span className=" text-red-300 font-bold text-sm mt-1">
                                                        Atenção: EMAIL NÃO CADASTRADO. Sem um e-mail cadastrado, você não receberá confirmação sobre sua solicitação.
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-center justify-center px-4">
                                <div className="w-full">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-white/15 backdrop-blur-md rounded-2xl px-8 py-2 ring-1 ring-white/20 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                    Assine abaixo
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={clearSignature}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all ring-1 ring-white/20"
                                                >
                                                    <ArrowPathIcon className="h-5 w-5" />
                                                    Limpar
                                                </button>
                                            </div>

                                            <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-4 ring-2 ring-white/30">
                                                <canvas
                                                    ref={canvasRef}
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                    onMouseUp={stopDrawing}
                                                    onMouseLeave={stopDrawing}
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onTouchEnd={stopDrawing}
                                                    className="w-full h-[200px] md:h-[150px] bg-white rounded-xl border-4 border-dashed border-cyan-300 cursor-crosshair touch-none shadow-2xl"
                                                    style={{ touchAction: 'none' }}
                                                />
                                                {!hasDrawn && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="text-center">
                                                            <PencilSquareIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                            <p className="text-gray-400 text-xl font-medium">
                                                                Assine aqui
                                                            </p>
                                                            <p className="text-gray-400 text-sm mt-1">
                                                                Use o dedo ou caneta stylus
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {errors.assinatura && (
                                                <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 ring-1 ring-red-400/30">
                                                    <p className="text-white text-center">{errors.assinatura}</p>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-4 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => window.history.back()}
                                                    disabled={processing}
                                                    className="py-2 px-4 rounded-xl text-lg font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all hover:scale-105 text-center border-2 border-white/30 disabled:opacity-50"
                                                >
                                                    Voltar
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={processing || !hasDrawn}
                                                    className="py-2 px-4 rounded-xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-xl hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                >
                                                    {processing ? (
                                                        <span className="inline-flex items-center gap-2">
                                                            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Enviando...
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2">
                                                            <CheckCircleIcon className="h-7 w-7" />
                                                            Confirmar assinatura
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </>
    );
}