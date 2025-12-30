import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CameraIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ArrowsRightLeftIcon,
    PhotoIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Foto({ dadosSolicitacao, tipoAtendimento }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [facingMode, setFacingMode] = useState('user');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [isStarting, setIsStarting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        ...dadosSolicitacao,
        foto: null, // File
    });

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    };

    const startCamera = async (mode = facingMode) => {
        setCameraError(null);
        setIsStarting(true);

        try {
            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch (e) {
            setCameraError(
                'Não foi possível acessar a câmera. Verifique as permissões do navegador ou envie uma foto abaixo.'
            );
        } finally {
            setIsStarting(false);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const switchCamera = async () => {
        const next = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(next);
        await startCamera(next);
    };

    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 720;

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);

        canvas.toBlob(
            (blob) => {
                if (!blob) return;

                if (previewUrl) URL.revokeObjectURL(previewUrl);

                const file = new File([blob], `foto-${Date.now()}.jpg`, { type: 'image/jpeg' });
                setData('foto', file);

                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
            },
            'image/jpeg',
            0.92
        );
    };

    const resetPhoto = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setData('foto', null);
    };

    const onPickFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setData('foto', file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.foto) {
            alert('Por favor, tire (ou envie) uma foto antes de continuar.');
            return;
        }

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;

            if (value instanceof File) {
                formData.append(key, value);
                return;
            }

            if (Array.isArray(value) || typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
                return;
            }

            formData.append(key, value);
        });

        post(route('solicitacoes.foto.store'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Foto - Solicitação" />

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
                                    <CameraIcon className="h-16 w-16 text-white" />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                Tire uma foto
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
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 ring-1 ring-white/20 space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <PhotoIcon className="h-7 w-7" />
                                        Foto do Solicitante
                                    </h2>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={switchCamera}
                                            disabled={processing || isStarting}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all ring-1 ring-white/20 disabled:opacity-50"
                                            title="Trocar câmera"
                                        >
                                            <ArrowsRightLeftIcon className="h-5 w-5" />
                                            Trocar
                                        </button>

                                        {previewUrl ? (
                                            <button
                                                type="button"
                                                onClick={resetPhoto}
                                                disabled={processing}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-all ring-1 ring-white/20 disabled:opacity-50"
                                            >
                                                <ArrowPathIcon className="h-5 w-5" />
                                                Refazer
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={capture}
                                                disabled={processing || isStarting || !!cameraError}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-teal-700 text-sm font-bold hover:bg-teal-600 hover:text-white transition-all ring-1 ring-white/20 disabled:opacity-50"
                                            >
                                                <CameraIcon className="h-5 w-5" />
                                                Capturar
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p className="text-white/90 text-sm">
                                    Centralize o rosto, com boa iluminação. Essa foto fica vinculada à solicitação.
                                </p>

                                <div className="relative overflow-hidden rounded-xl ring-1 ring-white/20 bg-black/20">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Prévia da foto"
                                            className="w-full h-[360px] object-cover"
                                        />
                                    ) : (
                                        <video
                                            ref={videoRef}
                                            playsInline
                                            muted
                                            className="w-full h-[360px] object-cover"
                                        />
                                    )}

                                    {!previewUrl && !cameraError && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-white/40" />
                                        </div>
                                    )}
                                </div>

                                <canvas ref={canvasRef} className="hidden" />

                                {cameraError && (
                                    <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border-l-4 border-yellow-400">
                                        <p className="text-yellow-100 text-sm flex items-start gap-2">
                                            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <span>{cameraError}</span>
                                        </p>
                                    </div>
                                )}

                            </div>

                            {errors.error && (
                                <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 ring-1 ring-red-400/30">
                                    <p className="text-white text-center">{errors.error}</p>
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
                                    disabled={processing || !data.foto}
                                    className="flex-1 py-4 px-6 rounded-xl bg-white border-4 border-double border-sky-700 font-bold text-teal-700 text-lg hover:bg-teal-600 hover:text-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {processing ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                                A solicitação só é enviada após a foto ser registrada.
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
                    <p className="text-white/80 text-sm">
                        PREVMOC - Instituto de Previdência dos Servidores de Montes Claros
                    </p>
                </div>
            </div>
        </>
    );
}
