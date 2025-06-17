import React from "react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
            <section className="flex flex-1 flex-col items-center justify-center bg-black px-8 py-14 text-center text-white md:text-left">
                <a
                    href="/"
                    className="mb-8 flex h-64 w-64 items-center justify-center rounded-full bg-white backdrop-blur transition hover:scale-105"
                >
                    <img
                        src="/images/logo_atende_ai.png"
                        alt="Logo do Sistema de Atendimento PREVMOC"
                        className="h-60 w-6h-60 object-contain"
                    />
                </a>

                <h1 className="mb-3 text-3xl font-extrabold leading-tight md:text-4xl">
                    Bem vindo novante ao sistema
                </h1>
                <p className="max-w-xs text-base font-light md:max-w-sm md:text-lg">
                    Acesse sua conta para continuar.
                </p>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2
                     text-xs text-white/75 md:left-8 md:translate-x-0">
                    ©{new Date().getFullYear()} Instituto Previdenciário • Todos os direitos reservados
                </span>
            </section>

            <section className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl sm:p-10">
                    {children}
                </div>
            </section>
        </div>
    );
}
