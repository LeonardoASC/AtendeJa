import Counter from '@/Components/Counter';
import { Head } from '@inertiajs/react';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Bem vindo" />
            <div className="font-sans text-gray-800 min-h-screen flex flex-col items-center justify-center bg-gray-50">
                {/* Adicionando a logo */}
                <img 
                    src="/images/logoestacionamento.png" 
                    alt="Logo do Sistema de Estacionamento" 
                    className="w-64 h-auto mb-6"
                />
                <h1 className="text-2xl font-bold mb-6">Sistema de Estacionamento</h1>
                {/* <div className="flex space-x-4">
                    <a 
                        href="/login/usuario" 
                        className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600 transition"
                    >
                        Login Usuário
                    </a>
                    <a 
                        href="/login" 
                        className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-600 transition"
                    >
                        Login Administrador
                    </a>
                </div> */}
                <Counter />
            </div>
        </>
    );
}