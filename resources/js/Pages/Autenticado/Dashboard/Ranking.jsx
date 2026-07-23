import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Svg1Podium from "./SVG/svg1";

export default function Ranking({ rankingAtendentes, top3, demaisAtendentes, period, label, totalNaoAtendidas, estatisticas }) {
    const podiumList = top3 ?? rankingAtendentes ?? [];
    const stats = estatisticas || { total: 0, por_status: {} };

    const gold = podiumList[0] ?? null;
    const silver = podiumList[1] ?? null;
    const bronze = podiumList[2] ?? null;
    const maxAtendimentos = podiumList[0]?.total_atendimentos || 1;

    const othersList = demaisAtendentes?.data ?? [];
    const currentPage = demaisAtendentes?.current_page ?? 1;
    const perPage = demaisAtendentes?.per_page ?? 5;

    const goToUrl = (url) => {
        if (!url) return;
        router.get(
            url,
            {},
            { preserveScroll: true, preserveState: true, replace: true }
        );
    };

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

                    {othersList.length > 0 && (
                        <div className="mt-10 max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-base sm:text-lg font-semibold text-neutral-200 flex items-center gap-2">
                                    <span>Demais Colocações</span>
                                    <span className="bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs px-2.5 py-0.5 rounded-full font-normal">
                                        {demaisAtendentes?.total ?? othersList.length} {demaisAtendentes?.total === 1 ? 'atendente' : 'atendentes'}
                                    </span>
                                </h3>
                            </div>

                            <div className="space-y-2.5">
                                {othersList.map((item, index) => {
                                    const position = 3 + (currentPage - 1) * perPage + index + 1;
                                    const percentage = Math.round((item.total_atendimentos / maxAtendimentos) * 100);

                                    return (
                                        <div
                                            key={item.atendente_nome || index}
                                            className="bg-neutral-800/40 backdrop-blur border border-neutral-700/50 hover:border-neutral-600 transition-all rounded-xl p-3.5 flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900/80 border border-neutral-700/60 flex items-center justify-center text-xs sm:text-sm font-bold text-neutral-400">
                                                    #{position}
                                                </span>
                                                <img
                                                    src={avatarFor(item.atendente_nome)}
                                                    alt={item.atendente_nome || "Atendente"}
                                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-neutral-700/60 flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm sm:text-base font-medium text-neutral-100 truncate">
                                                        {item.atendente_nome || "Sem nome"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-24 sm:w-32 bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="bg-neutral-400 h-full rounded-full transition-all duration-300"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] text-neutral-500 font-mono">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <span className="text-sm sm:text-base font-bold text-neutral-200 block">
                                                    {item.total_atendimentos}
                                                </span>
                                                <span className="text-[11px] text-neutral-400">
                                                    {item.total_atendimentos === 1 ? 'atendimento' : 'atendimentos'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {demaisAtendentes?.last_page > 1 && (
                                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 pt-4 border-t border-neutral-700/40">
                                    {demaisAtendentes.links.map((link, key) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={key}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 bg-neutral-900/40 cursor-not-allowed select-none"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => goToUrl(link.url)}
                                                className={[
                                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition",
                                                    link.active
                                                        ? "bg-neutral-100 text-neutral-900 font-bold shadow"
                                                        : "bg-neutral-800/60 border border-neutral-700/60 text-neutral-300 hover:bg-neutral-700/60"
                                                ].join(" ")}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
