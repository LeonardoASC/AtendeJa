import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

export default function CameraOCR({ onPlacaDetectada, forcarOCR, setForcarOCR }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Erro ao acessar câmera:", err);
            }
        };

        startCamera();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (processing || !videoRef.current || !canvasRef.current) return;
            capturarEReconhecer();
        }, 2000);

        return () => clearInterval(interval);
    }, [processing]);

    useEffect(() => {
        if (!forcarOCR || processing) return;
        capturarEReconhecer(() => setForcarOCR(false));
    }, [forcarOCR]);

    const capturarEReconhecer = (callback) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        setProcessing(true);
        canvas.toBlob(async (blob) => {
            if (!blob) {
                setProcessing(false);
                if (callback) callback();
                return;
            }

            try {
                const { data: { text } } = await Tesseract.recognize(blob, 'eng', {
                    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                });

                const placa = text.trim().toUpperCase().replace(/\s+/g, '').match(/[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/);
                if (placa && placa[0]) {
                    onPlacaDetectada(placa[0]);
                }
            } catch (err) {
                console.error('Erro no OCR:', err);
            } finally {
                setProcessing(false);
                if (callback) callback();
            }
        }, 'image/jpeg');
    };

    return (
        <div className="mb-4">
            <video ref={videoRef} autoPlay muted className="w-full rounded-md border shadow" />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
