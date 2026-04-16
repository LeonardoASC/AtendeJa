import React from 'react'
import { Head } from '@inertiajs/react'
import { CheckCircle2 } from 'lucide-react'

export default function Sucesso({ servico, redirectUrl = '/admin/senhas' }) {
    const [contador, setContador] = React.useState(5)

    React.useEffect(() => {
        const intervalo = window.setInterval(() => {
            setContador((atual) => {
                if (atual <= 1) {
                    window.clearInterval(intervalo)
                    window.location.href = redirectUrl
                    return 0
                }

                return atual - 1
            })
        }, 3000)

        return () => window.clearInterval(intervalo)
    }, [redirectUrl])

    return (
        <>
            <Head title="Avaliacao enviada" />

            <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 px-4 py-8">
                <div className="w-full max-w-2xl rounded-3xl bg-white/10 p-8 text-center ring-1 ring-white/30 shadow-2xl backdrop-blur-lg">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-300/40">
                        <CheckCircle2 className="h-12 w-12 text-emerald-200" />
                    </div>

                    <h1 className="mt-6 text-4xl font-extrabold text-white">Muito obrigado pela sua avaliacao</h1>
                    <p className="mt-3 text-lg text-white/90 leading-relaxed">
                        Sua resposta foi registrada com sucesso e ja faz parte da melhoria continua do nosso atendimento.
                    </p>
                    <p className="mt-2 text-base text-white/85 leading-relaxed">
                        Agradecemos por dedicar um tempo para avaliar o servico <span className="font-semibold">{servico?.nome}</span>. Cada opiniao nos ajuda a atender melhor as proximas pessoas.
                    </p>

                    <div className="mt-6 rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-left text-white/90 space-y-2">
                        <p className="font-semibold text-white">O que acontece agora:</p>
                        <p>- Sua avaliacao foi enviada e contabilizada.</p>
                        <p>- Nossa equipe utiliza esse retorno para melhorar o processo.</p>
                        <p>- Voce sera levado para a tela inicial de senhas.</p>
                    </div>

                    <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-white/90">
                        Redirecionamento automatico em <span className="font-bold text-white">{contador}s</span> para continuar o atendimento.
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = redirectUrl
                        }}
                        className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                    >
                        Ir agora para tela de senhas
                    </button>
                </div>
            </main>
        </>
    )
}
