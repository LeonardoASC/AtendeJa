import { usePage } from '@inertiajs/react';
import react, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function GuestLayout({ children }) {
    const flash = usePage().props.flash || {};
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <div className="flex shrink-0 items-center">
                    <a href="/" className="flex items-center">
                        <div className="h-20 w-20 rounded flex items-center justify-center">
                            <img
                                src="/images/logoestacionamento.png"
                                alt="Logo do Sistema de Estacionamento"
                                className="w-64 h-auto mb-6"
                            />
                        </div>
                    </a>
                </div>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
