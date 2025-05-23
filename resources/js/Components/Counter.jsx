import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function Counter({ initialValue = 0 }) {
    const [counter, setCounter] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const channel = window.Echo.channel('counter');
        channel.listen('.counter.updated', (e) => {
            setCounter(e.value);
        });
        return () => {
            channel.stopListening('.counter.updated');
        };
    }, []);

    const incrementCounter = () => {
        if (loading) return;
        setLoading(true);
        router.post(route('counter.increment'), {}, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    const decrementCounter = () => {
        if (loading) return;
        setLoading(true);
        router.post(route('counter.decrement'), {}, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Contador em Tempo Real</h2>

            <div className="text-6xl font-bold mb-8">{counter}</div>

            <div className="flex space-x-4">
                <button
                    onClick={decrementCounter}
                    disabled={loading}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:opacity-50 transition-colors duration-200"
                >
                    Diminuir
                </button>

                <button
                    onClick={incrementCounter}
                    disabled={loading}
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 transition-colors duration-200"
                >
                    Aumentar
                </button>
            </div>

            <p className="mt-4 text-gray-600 text-sm">
                Este contador é sincronizado em tempo real entre todos os navegadores conectados.
            </p>
        </div>
    );
}
