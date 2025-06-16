import { Head } from '@inertiajs/react';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Bem vindo" />
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