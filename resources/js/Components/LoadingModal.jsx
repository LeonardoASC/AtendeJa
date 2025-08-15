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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                ref={boxRef}
                role="dialog"
                aria-modal="true"
                aria-label={message}
                tabIndex={-1}
                className="relative z-[101] mx-auto mt-[20vh] w-[92%] max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10 text-center animate-[fadeIn_.15s_ease-out]"
            >
                <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
                <p className="text-base font-semibold text-gray-900">{message}</p>
                <p className="mt-1 text-xs text-gray-500">Isso pode levar alguns segundos.</p>

                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-1/3 animate-[slide_1.2s_infinite_linear] bg-gray-600 rounded-full" />
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes slide {
                0%   { transform: translateX(-100%); }
                50%  { transform: translateX(50%); }
                100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );
}

export default LoadingModal;
