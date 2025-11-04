import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Svg1Podium from "./SVG/svg1";

export default function Ranking({ rankingAtendentes, period, label, totalNaoAtendidas, estatisticas }) {
    const ranking = rankingAtendentes ?? [];
    const stats = estatisticas || { total: 0, por_status: {} };

    const gold = ranking[0] ?? null;
    const silver = ranking[1] ?? null;
    const bronze = ranking[2] ?? null;

    const avatarFor = (name) =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "")}&background=1f1f1f&color=fff&size=400`;

    const formatarStatus = (status) => {
        if (!status) return 'Indefinido';

        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const periods = [
        { id: "today", text: "Hoje" },
        { id: "week", text: "Semana" },
        { id: "month", text: "Mês" },
        { id: "year", text: "Ano" },
        { id: "all", text: "Todos" },
    ];

    const go = (p) =>
        router.get(
            route("dashboard.ranking"),
            { period: p },
            { preserveScroll: true, preserveState: true, replace: true }
        );

    const isActive = (p) => (period ?? "week") === p;

    return (
        <AuthenticatedLayout>
            <Head title="Ranking de Atendentes" />
            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
                <div className="max-w-[1140px] mx-auto px-4 py-10 sm:py-12 text-neutral-100">

                    <div className="mb-6 sm:mb-8">
                        <div className="text-center">
                            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                Ranking de Atendentes
                            </h2>
                            <p className="mt-1 text-sm text-neutral-400">
                                Período: <span className="font-medium text-neutral-200">{label || "esta semana"}</span>
                            </p>
                            {totalNaoAtendidas !== undefined && totalNaoAtendidas > 0 && (
                                <p className="mt-2 text-xs text-amber-400/80">
                                    {totalNaoAtendidas} senha{totalNaoAtendidas !== 1 ? 's' : ''} pendente{totalNaoAtendidas !== 1 ? 's' : ''} (não atendida{totalNaoAtendidas !== 1 ? 's' : ''})
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {periods.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => go(p.id)}
                                    className={[
                                        "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-sm transition",
                                        isActive(p.id)
                                            ? "bg-neutral-100 text-neutral-900 border-neutral-100"
                                            : "bg-neutral-800/60 text-neutral-200 border-neutral-700 hover:bg-neutral-700/60"
                                    ].join(" ")}
                                >
                                    {p.text}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 bg-neutral-800/40 backdrop-blur border border-neutral-700/50 rounded-lg p-2 sm:p-3 max-w-2xl mx-auto">
                            <h3 className="text-sm font-medium text-neutral-300 mb-3 text-center">Estatísticas do Período</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div className="text-center p-3 bg-neutral-900/50 rounded-lg border border-neutral-700/30">
                                    <div className="text-xl sm:text-2xl font-bold text-neutral-100">
                                        {stats.total || 0}
                                    </div>
                                    <div className="text-xs sm:text-sm text-neutral-400 mt-1">
                                        Total de Senhas
                                    </div>
                                </div>
                                {Object.entries(stats.por_status).map(([status, count]) => (
                                    <div key={status} className="text-center p-3 bg-neutral-900/50 rounded-lg border border-neutral-700/30">
                                        <div className="text-xl sm:text-2xl font-bold text-neutral-100">
                                            {count}
                                        </div>
                                        <div className="text-xs sm:text-sm text-neutral-400 mt-1">
                                            {formatarStatus(status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mb-10 sm:mb-12">
                        <div className="w-full md:w-2/3">
                            <div id="podium-winners">
                                <div
                                    id="winners"
                                    className="flex items-start justify-between gap-4 px-2
                                               md:block md:relative md:h-[180px] md:mb-32 md:px-0"
                                >
                                    <div
                                        id="winner-silver"
                                        className="flex flex-col items-center w-[92px] sm:w-[110px]
                                                   md:w-[140px] md:absolute md:top-10 md:left-[10%]"
                                    >
                                        <div className="p-[6px] rounded-full border border-neutral-700 bg-neutral-800/70 backdrop-blur mb-2 ring-2 ring-zinc-300/50">
                                            <img
                                                src={avatarFor(silver?.atendente_nome)}
                                                alt={silver?.atendente_nome || "Second place"}
                                                className="block w-[90px] h-[90px] sm:w-[104px] sm:h-[104px] md:w-[124px] md:h-[124px] object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="text-center text-xs sm:text-sm md:text-base m-0 text-neutral-100">
                                            {silver?.atendente_nome ?? "—"}
                                        </h3>
                                        {silver && (
                                            <div className="text-center text-[10px] sm:text-xs md:text-sm mt-1 text-neutral-400">
                                                {silver.total_atendimentos} atendimentos
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        id="winner-gold"
                                        className="flex flex-col items-center w-[92px] sm:w-[110px]
                                                   md:w-[140px] md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2"
                                    >
                                        <div className="p-[6px] rounded-full border border-neutral-700 bg-neutral-800/70 backdrop-blur mb-2 ring-2 ring-amber-400/60">
                                            <img
                                                src={avatarFor(gold?.atendente_nome)}
                                                alt={gold?.atendente_nome || "First place"}
                                                className="block w-[96px] h-[96px] sm:w-[112px] sm:h-[112px] md:w-[124px] md:h-[124px] object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="text-center text-xs sm:text-sm md:text-base m-0 text-neutral-100">
                                            {gold?.atendente_nome ?? "—"}
                                        </h3>
                                        {gold && (
                                            <div className="text-center text-[10px] sm:text-xs md:text-sm mt-1 text-neutral-400">
                                                {gold.total_atendimentos} atendimentos
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        id="winner-bronze"
                                        className="flex flex-col items-center w-[92px] sm:w-[110px]
                                                   md:w-[140px] md:absolute md:top-20 md:right-[15%]"
                                    >
                                        <div className="p-[6px] rounded-full border border-neutral-700 bg-neutral-800/70 backdrop-blur mb-2 ring-2 ring-orange-500/60">
                                            <img
                                                src={avatarFor(bronze?.atendente_nome)}
                                                alt={bronze?.atendente_nome || "Third place"}
                                                className="block w-[90px] h-[90px] sm:w-[104px] sm:h-[104px] md:w-[124px] md:h-[124px] object-cover rounded-full"
                                            />
                                        </div>
                                        <h3 className="text-center text-xs sm:text-sm md:text-base m-0 text-neutral-100">
                                            {bronze?.atendente_nome ?? "—"}
                                        </h3>
                                        {bronze && (
                                            <div className="text-center text-[10px] sm:text-xs md:text-sm mt-1 text-neutral-400">
                                                {bronze.total_atendimentos} atendimentos
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full max-w-[520px] sm:max-w-[600px] mx-auto mt-6 md:mt-0">
                                    <Svg1Podium />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-neutral-700/40 to-transparent" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
