import { Head } from '@inertiajs/react';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Bem vindo" />

            <button
                onClick={() => window.toggleFullscreen?.()}
                aria-label="Entrar em tela cheia"
                className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2 shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Tela cheia
            </button>

            <div className="font-sans text-gray-800 min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <img
                    src="/images/logo_atende_ai.png"
                    alt="Logo do Sistema de atende aí"
                    className="w-96 h-auto mb-6"
                />
                <div className="flex space-x-4">
                    <a
                        href="/login"
                        className="px-8 py-4 text-xl bg-gray-900 text-white rounded-2xl hover:bg-gray-600 transition"
                    >
                        Login Administrador
                    </a>
                </div>


            </div>
        </>
    );
}
