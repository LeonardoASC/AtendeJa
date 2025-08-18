import { Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({
    isOpen,
    onClose,
    title,
    width = 'max-w-xl',
    children,
}) {
    
    useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = original);
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && isOpen && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <Fragment>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ opacity: 0, scale: 0.9, y: 32 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 32 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
                    >
                        <div
                            className={`relative w-full ${width} overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-gray-600/20 backdrop-blur-lg`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <header
                                className={`flex items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600`}
                            >
                                {title && (
                                    <h2 className="text-base font-semibold text-white tracking-tight">
                                        {title}
                                    </h2>
                                )}

                                <button
                                    onClick={onClose}
                                    className="grid place-items-center rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </header>

                            <div className="px-6 py-6">{children}</div>
                        </div>
                    </motion.div>
                </Fragment>
            )}
        </AnimatePresence>,
        document.body,
    );
}
