// resources/js/Pages/Autenticado/Guiches/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BuildingOffice2Icon,
    CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';

/* ----- Card (efeito glass branco) --------------------------------------- */
function BoothCard({ id, numero }) {
    return (
        <Link
            href={route('guiche.panel', numero)}
            key={id}
            className="group relative rounded-2xl p-px transition-shadow hover:shadow-2xl"
        >
            {/* borda com leve gradiente institucional */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 opacity-20 group-hover:opacity-40" />
            {/* conteúdo em “glass” branco */}
            <div className="relative flex flex-col items-center justify-center rounded-[inherit] bg-white/20 backdrop-blur-md py-10 px-7 text-gray-100">
                <BuildingOffice2Icon className="h-9 w-9 text-teal-200 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-semibold tracking-wide">
                    Guichê&nbsp;{numero}
                </span>
                <p className="mt-2 text-sm text-gray-200 text-center">
                    Estação de atendimento onde as senhas são chamadas e cronomet­radas.
                </p>
                <CursorArrowRaysIcon className="absolute bottom-3 right-3 h-5 w-5 text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </Link>
    );
}

/* ----------------------------------------------------------------------- */
export default function Guiches({ guiches = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-100">
                    Guichês
                </h2>
            }
        >
            <Head title="Escolha o Guichê" />

            {/* Fundo preto fosco (gradiente de neutros) */}
            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Introdução descritiva */}
                    <section className="mb-10 max-w-2xl text-gray-300">
                        <p className="text-lg">
                            Escolha abaixo o guichê para o qual deseja iniciar o painel de
                            atendimento. Cada guichê é uma estação individual onde os
                            atendentes:
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Chamam senhas em tempo real.</li>
                            <li>Registram tempo de atendimento para métricas.</li>
                            <li>Acompanham a fila e histórico de clientes.</li>
                        </ul>
                    </section>

                    {/* Cards */}
                    {guiches.length ? (
                        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {guiches.map((g) => (
                                <BoothCard key={g.id} id={g.id} numero={g.numero} />
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-white/10 p-8 text-center text-gray-200 backdrop-blur">
                            Nenhum guichê cadastrado.
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
