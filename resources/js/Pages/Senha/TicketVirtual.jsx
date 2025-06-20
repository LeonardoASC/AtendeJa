import React from 'react';
import { Head } from '@inertiajs/react';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';

export default function TicketVirtual({ senha }) {
    return (
        <>
            <Head title={`Ticket • ${senha.codigo}`} />

            <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-100 print:bg-white">
                <div
                    className="w-full max-w-xs bg-[#FFF6D2] text-gray-900 font-mono tracking-wide shadow-xl border-[6px] border-[#d9bf4f]
                               px-4 py-6 relative flex flex-col gap-5 print:shadow-none print:border-0"
                    style={{ minHeight: '560px' }}
                >
                    <div className="absolute -top-3 left-0 right-0 h-3 bg-repeat-x bg-[radial-gradient(circle,_transparent_4px,_#FFF6D2_5px)]" />
                    <div className="absolute -bottom-3 left-0 right-0 h-3 bg-repeat-x bg-[radial-gradient(circle,_transparent_4px,_#FFF6D2_5px)]" />

                    <header className="flex flex-col items-center leading-tight">
                        <span className="text-[16px] font-bold tracking-widest">PREVMOC</span>
                        <span className="text-xs text-center">Sistema de atendimento e Ticket Virtual</span>
                    </header>

                    <main className="flex-1 flex flex-col items-center justify-center gap-6">
                        <h1 className="text-5xl font-extrabold">{senha.codigo}</h1>

                        <div className="w-full border-t border-dashed border-[#d9bf4f]" />

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-base font-semibold">SERVIÇO</span>
                                <span className="text-xl">{senha.tipo}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-base font-semibold">CPF</span>
                                <span className="text-xl">222.222.222-22</span>
                            </div>
                            <div className='flex flex-row gap-2 items-center justify-center mt-2'>
                                <CalendarDaysIcon class="h-6 w-6 text-gray-500" />
                                <span className="text-base text-gray-600">{senha.created_at}</span>
                            </div>
                        </div>
                    </main>

                    <div className="w-full border-t border-dashed border-[#d9bf4f]" />

                    <footer className="text-center text-xs leading-tight mt-4">
                        Guarde este ticket até o atendimento
                    </footer>
                </div>
            </div>
        </>
    );
}
