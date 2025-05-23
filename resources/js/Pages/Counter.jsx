import React from 'react';
import { Head } from '@inertiajs/react';
import Counter from '@/Components/Counter';

export default function CounterPage() {
    return (
        <>
            <Head title="Contador em Tempo Real" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Counter />
            </div>
        </>
    );
}
