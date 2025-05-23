import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const tipos = [
    { label: 'Prova de Vida', value: 'prova_de_vida', prefix: 'PV' },
    { label: 'Processo Administrativo', value: 'processo_administrativo', prefix: 'PA' },
    { label: 'Adiantamento 13°', value: 'adiantamento_13', prefix: 'AD' },
    { label: 'Informações Aposentadoria', value: 'info_aposentadoria', prefix: 'IA' },
    { label: 'Contribuição Previdenciária', value: 'info_contribuicao', prefix: 'CP' },
];

export default function Index() {
    const [step, setStep] = useState(1);
    const [cpf, setCpf] = useState('');
    const [selectedTipo, setSelectedTipo] = useState(null);
    const form = useForm({
        tipo: '',
        cpf: '',
    });

    function handleTipoSelect(tipo) {
        setSelectedTipo(tipo);
        form.setData('tipo', tipo.value);
        setStep(2);
    }

    function handleKeyPress(digit) {
        if (cpf.length < 11) setCpf(c => c + digit);
    }

    function handleBackspace() {
        setCpf(c => c.slice(0, -1));
    }

    function submit() {
        form.setData('cpf', cpf);
        form.post(route('senhas.store'), {
            onSuccess: () => {
                setCpf('');
                setStep(1);
                setSelectedTipo(null);
            }
        });
    }

    return (
        <>
            <Head title="Gerar Senha" />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                    {step === 1 && (
                        <>
                            <h2 className="text-xl font-semibold mb-4 text-center">Selecione o tipo de atendimento</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {tipos.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => handleTipoSelect(t)}
                                        className="py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <button
                                onClick={() => { setStep(1); setCpf(''); }}
                                className="text-sm text-teal-600 hover:underline mb-2"
                            >
                                ← Voltar
                            </button>
                            <h2 className="text-xl font-semibold mb-2 text-center">
                                {selectedTipo.label}
                            </h2>
                            <div className="bg-gray-200 rounded-lg p-4 mb-4 text-center font-mono text-2xl tracking-widest">
                                {cpf.padEnd(11, '•')}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => handleKeyPress(d)}
                                        className="py-4 bg-white rounded-lg shadow hover:bg-gray-50 transition text-xl"
                                    >
                                        {d}
                                    </button>
                                ))}
                                <button
                                    onClick={handleBackspace}
                                    className="col-span-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                >
                                    Apagar
                                </button>
                            </div>
                            <button
                                onClick={submit}
                                disabled={cpf.length !== 11 || form.processing}
                                className="w-full py-3 bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition"
                            >
                                {form.processing ? 'Gerando...' : 'Confirmar'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
