import React, { useEffect, useRef } from 'react';

function LoadingModal({ open, message = 'Consultando CPF…' }) {
    const boxRef = useRef(null);

    useEffect(() => {
        if (open && boxRef.current) {
            boxRef.current.focus();
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] cursor-wait">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            <div
                ref={boxRef}
                role="dialog"
                aria-modal="true"
                aria-label={message}
                tabIndex={-1}
                className="relative z-[101] mx-auto mt-[20vh] w-[92%] max-w-md rounded-3xl bg-gradient-to-br from-white via-cyan-50 to-teal-50 p-8 shadow-2xl ring-1 ring-cyan-200/50 text-center animate-[fadeInScale_.3s_ease-out]"
            >
                <div className="relative mx-auto mb-6 h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-200/30"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-teal-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 animate-pulse"></div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 mb-2">
                    {message}
                </h3>

                <p className="text-sm text-gray-600 mb-6">
                    Aguarde enquanto processamos sua solicitação...
                </p>

                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-100 to-teal-100">
                    <div className="absolute inset-0 animate-[shimmer_1.5s_infinite_ease-in-out]">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
                    </div>
                    <div className="h-full w-2/5 animate-[slideProgress_1.8s_infinite_ease-in-out] bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
                </div>

                <div className="absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-400/10 to-transparent animate-[rotate_3s_linear_infinite]"></div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes slideProgress {
                    0% {
                        transform: translateX(-100%);
                    }
                    50% {
                        transform: translateX(150%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default LoadingModal;
