import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ tipoAtendimentos }) {
    const [step, setStep] = useState(0);
    const [senhaGerada, setSenhaGerada] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({ tipo: '', cpf: '' });

    function handleDigit(d) {
        if (data.cpf.length < 11) setData('cpf', data.cpf + d);
    }
    function handleBackspace() {
        setData('cpf', data.cpf.slice(0, -1));
    }
    function handleClear() {
        setData('cpf', '');
    }

    function submit(e) {
        e.preventDefault();
        post(route('senhas.store'), {
            onSuccess: (page) => {
                const senha = page.props.senha;
                setSenhaGerada(senha);
                setStep(3);
            },
        });
    }

    function handleRestart() {
        reset();
        setSenhaGerada(null);
        setStep(0);
    }

    const steps = ['Início', 'Serviço', 'CPF', 'Concluído'];

    return (
        <>
            <Head title="Criar Senha" />
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-4 md:p-8 overflow-hidden">

                <div className="w-full h-full bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">

                    <div className="flex justify-between p-4 md:p-6">
                        {steps.map((label, idx) => (
                            <div key={idx} className="flex-1 text-center">
                                <div className={`mx-auto w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base ${step === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{idx + 1}</div>
                                <p className={`mt-1 text-xs md:text-sm ${step === idx ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-6">

                        {step === 0 && (
                            <div className="flex flex-col items-center space-y-6 w-full">
                                <h3 className="text-2xl md:text-3xl font-semibold">Bem-vindo!</h3>
                                <p className="text-lg md:text-xl text-gray-600">Clique abaixo para gerar uma senha.</p>
                                <button onClick={() => setStep(1)} className="w-full py-6 md:py-8 bg-blue-600 text-white rounded-xl text-lg md:text-2xl hover:bg-blue-700 transition">Iniciar</button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="flex flex-col space-y-6 w-full h-full">
                                <h3 className="text-xl md:text-2xl font-medium">Selecione o serviço</h3>
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                    {tipoAtendimentos.map(tipo => (
                                        <button key={tipo.id} onClick={() => { setData('tipo', tipo.nome); setStep(2); }} className="py-8 md:py-10 bg-gray-100 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition text-base md:text-lg font-medium">{tipo.nome}</button>
                                    ))}
                                </div>
                                <button onClick={() => setStep(0)} className="py-3 md:py-4 px-4 md:px-6 border rounded-lg text-base md:text-lg">Voltar</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col space-y-6 w-full h-full">
                                <h3 className="text-xl md:text-2xl font-medium text-center">Digite seu CPF</h3>
                                <div className="text-2xl md:text-3xl tracking-widest text-center flex-1 flex items-center justify-center">{data.cpf.padEnd(11, '_')}</div>
                                {errors.cpf && <p className="text-red-600 text-base md:text-lg text-center">{errors.cpf}</p>}

                                <div className="grid grid-cols-3 gap-2 md:gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                        <button key={n} onClick={() => handleDigit(n.toString())} className="py-6 md:py-8 rounded-lg text-xl md:text-2xl font-medium hover:bg-gray-300 active:bg-gray-400 transition bg-gray-200">{n}</button>
                                    ))}
                                    <button onClick={handleBackspace} className="py-6 md:py-8 rounded-lg text-xl md:text-2xl font-medium hover:bg-yellow-300 active:bg-yellow-400 transition bg-yellow-200">⌫</button>
                                    <button onClick={() => handleDigit('0')} className="py-6 md:py-8 rounded-lg text-xl md:text-2xl font-medium hover:bg-gray-300 active:bg-gray-400 transition bg-gray-200">0</button>
                                    <button onClick={handleClear} className="py-6 md:py-8 rounded-lg text-xl md:text-2xl font-medium hover:bg-red-300 active:bg-red-400 transition bg-red-200">C</button>
                                </div>

                                <div className="flex justify-between w-full">
                                    <button type="button" onClick={() => setStep(1)} className="py-4 md:py-5 px-6 md:px-8 border rounded-lg text-base md:text-lg">Voltar</button>
                                    <button onClick={submit} disabled={processing || data.cpf.length < 11} className="py-4 md:py-5 px-6 md:px-8 bg-blue-600 text-white rounded-xl text-base md:text-xl hover:bg-blue-700 transition disabled:opacity-50">{processing ? 'Enviando...' : 'Gerar Senha'}</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && senhaGerada && (
                            <div className="flex flex-col space-y-6 w-full">
                                <h3 className="text-2xl md:text-3xl font-semibold text-center text-green-600">Senha Gerada!</h3>
                                <div className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-lg text-black md:text-xl"><span className="font-medium">Serviço:</span> {senhaGerada.tipo}</p>
                                    <p className="text-lg md:text-xl"><span className="font-medium">CPF:</span> {senhaGerada.cpf}</p>
                                    <p className="text-2xl md:text-4xl font-bold"><span className="font-medium">Código:</span> {senhaGerada.codigo}</p>
                                </div>
                                <button onClick={handleRestart} className="mt-4 w-full py-6 md:py-8 bg-blue-600 text-white rounded-xl text-lg md:text-2xl hover:bg-blue-700 transition">Gerar Nova Senha</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
