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
                    className="relative w-full max-w-7xl rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/30 shadow-2xl overflow-hidden"
                >
                    <div className="p-4 md:p-6">
                        <div className="py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
                                <div className="text-left space-y-4 px-4">
                                    <div>
                                        <p className="text-2xl lg:text-2xl font-extrabold text-white leading-tight text-center">Tire uma</p>
                                        <p className="text-2xl lg:text-3xl font-extrabold text-white leading-tight text-center">FOTO</p>
                                        <div className='flex items-center justify-center gap-4'>
                                            <p className="text-2xl lg:text-2xl font-extrabold text-white leading-tight text-center">AGORA!</p>
                                            <img
                                                src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png"
                                                alt="Logo Prevmoc"
                                                className='h-8 bg-white rounded-full p-1 mb-2 object-contain'
                                            />
                                        </div>
                                    </div>

                                    <p className="text-lg text-white/90">
                                        Tire uma foto para completar sua solicitação.
                                    </p>

                                    <div className="space-y-4 text-white/90 text-lg">
                                        <div className="">
                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white font-bold">
                                                    1
                                                </span>
                                                <p className="">
                                                    Centralize o rosto na câmera
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white font-bold">
                                                    2
                                                </span>
                                                <p className="">
                                                    Certifique-se de boa iluminação
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

                                    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/20">
                                        <h3 className="text-lg font-bold text-white mb-3">Resumo da Solicitação</h3>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            <div>
                                                <span className="text-white/70">Nome:</span>
                                                <p className="text-white font-medium">{dadosSolicitacao.nome}</p>
                                            </div>
                                            <div>
                                                <span className="text-white/70">CPF:</span>
                                                <p className="text-white font-medium">{dadosSolicitacao.cpf}</p>
                                            </div>
                                            {dadosSolicitacao.email && (
                                                <div>
                                                    <span className="text-white/70">E-mail:</span>
                                                    <p className="text-white font-medium">{dadosSolicitacao.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 px-4">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl px-8 py-6 ring-2 ring-white/30 shadow-2xl space-y-6 border border-white/10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">

                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">Foto do Solicitante</h3>
                                                        <p className="text-sm text-white/70">Foto do solicitante para identificação</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <motion.button
                                                        type="button"
                                                        onClick={switchCamera}
                                                        disabled={processing || isStarting}
                                                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-white text-sm font-semibold hover:from-cyan-500/30 hover:to-teal-500/30 transition-all ring-2 ring-white/30 disabled:opacity-50 shadow-lg hover:shadow-xl"
                                                        title="Trocar câmera"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <ArrowsRightLeftIcon className="h-5 w-5" />
                                                        Trocar
                                                    </motion.button>

                                                    {previewUrl ? (
                                                        <motion.button
                                                            type="button"
                                                            onClick={resetPhoto}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white text-sm font-semibold hover:from-red-500/30 hover:to-pink-500/30 transition-all ring-2 ring-white/30 disabled:opacity-50 shadow-lg hover:shadow-xl"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <ArrowPathIcon className="h-5 w-5" />
                                                            Refazer
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            type="button"
                                                            onClick={capture}
                                                            disabled={processing || isStarting || !!cameraError}
                                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-white to-cyan-100 text-teal-700 text-sm font-bold hover:from-cyan-100 hover:to-white transition-all ring-2 ring-white/50 disabled:opacity-50 shadow-lg hover:shadow-xl"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <CameraIcon className="h-5 w-5" />
                                                            Capturar
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-400 rounded-2xl blur opacity-30"></div>
                                                <div className="relative overflow-hidden rounded-2xl ring-4 ring-white/40 bg-gradient-to-br from-black/20 to-black/40 max-w-md mx-auto shadow-2xl">
                                                    {previewUrl ? (
                                                        <motion.img
                                                            src={previewUrl}
                                                            alt="Prévia da foto"
                                                            className="w-full aspect-square object-cover"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    ) : (
                                                        <video
                                                            ref={videoRef}
                                                            playsInline
                                                            muted
                                                            className="w-full aspect-square object-cover"
                                                        />
                                                    )}

                                                    {!previewUrl && !cameraError && (
                                                        <div className="absolute inset-0 pointer-events-none">
                                                            <div className="absolute inset-4 rounded-xl border-4 border-dashed border-white/50 animate-pulse" />
                                                            <div className="absolute inset-8 rounded-lg border-2 border-dashed border-cyan-300/60" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-500/20 flex items-center justify-center">
                                                                        <CameraIcon className="h-8 w-8 text-white/60" />
                                                                    </div>
                                                                    <p className="text-white/80 text-lg font-medium">
                                                                        Posicione seu rosto aqui
                                                                    </p>
                                                                    <p className="text-white/60 text-sm mt-1">
                                                                        Centralize e sorria! 😊
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {previewUrl && (
                                                        <div className="absolute top-4 right-4">
                                                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <canvas ref={canvasRef} className="hidden" />

                                            {cameraError && (
                                                <motion.div
                                                    className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 border-l-4 border-red-400 shadow-lg"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                >
                                                    <p className="text-red-100 text-sm flex items-start gap-2">
                                                        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                        <span>{cameraError}</span>
                                                    </p>
                                                </motion.div>
                                            )}

                                            {errors.error && (
                                                <motion.div
                                                    className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 ring-1 ring-red-400/30 shadow-lg"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                >
                                                    <p className="text-white text-center">{errors.error}</p>
                                                </motion.div>
                                            )}

                                            <div className="flex justify-end gap-4 pt-4">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => window.history.back()}
                                                    disabled={processing}
                                                    className="py-3 px-6 rounded-xl text-lg font-semibold text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition-all hover:scale-105 text-center border-2 border-white/30 disabled:opacity-50 shadow-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Voltar
                                                </motion.button>

                                                <motion.button
                                                    type="submit"
                                                    disabled={processing || !data.foto}
                                                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-white to-cyan-100 border-4 border-double border-sky-700 font-bold text-teal-700 text-xl hover:from-cyan-100 hover:to-white hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {processing ? (
                                                        <span className="inline-flex items-center gap-2">
                                                            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                            </svg>
                                                            Enviando...
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2">
                                                            <CheckCircleIcon className="h-7 w-7" />
                                                            Confirmar foto
                                                        </span>
                                                    )}
                                                </motion.button>
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
