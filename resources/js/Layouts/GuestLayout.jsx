import react from 'react';
export default function GuestLayout({ children }) {
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
        </div>
    );
}
