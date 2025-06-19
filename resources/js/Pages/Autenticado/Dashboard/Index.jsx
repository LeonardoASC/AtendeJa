// resources/js/Pages/Autenticado/Dashboard/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import {
    UserIcon,
    CalendarDaysIcon,
    ClockIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import DashboardCard from './Partials/DashboardCard';

function formatSeconds(total) {
    if (total == null) return '-';
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
}

export default function Dashboard({ metrics = {}, seriesHora = {} }) {
    const chartData = Array.from({ length: 24 }, (_, h) => ({
        hora: `${String(h).padStart(2, '0')}:00`,
        total: seriesHora[h] ?? 0,
    }));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-100">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* Fundo preto fosco */}
            <div className="min-h-screen bg-gradient-to-br from-neutral-800 via-neutral-900 to-black py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Introdução */}
                    <section className="mb-10 max-w-3xl text-gray-300">
                        <p className="text-lg">
                            Painel gerencial em tempo real. As métricas abaixo consolidam o
                            desempenho dos atendimentos e apontam gargalos operacionais.
                        </p>
                        <ul className="mt-4 list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>
                                <strong>Volume:</strong> acompanha a quantidade de senhas
                                concluídas em diferentes janelas de tempo.
                            </li>
                            <li>
                                <strong>Produtividade:</strong> mede o tempo médio de
                                atendimento para identificar oportunidades de otimização.
                            </li>
                            <li>
                                <strong>Pico de demanda:</strong> revela o horário mais
                                movimentado do dia para reforçar a equipe.
                            </li>
                        </ul>
                    </section>

                    {/* Métricas em cards */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <DashboardCard
                            title="CPF mais frequente"
                            value={metrics.cpf_mais_frequente || '-'}
                            icon={UserIcon}
                        />
                        <DashboardCard
                            title="Atendidas hoje"
                            value={metrics.dia ?? 0}
                            icon={CalendarDaysIcon}
                        />
                        <DashboardCard
                            title="Atendidas na semana"
                            value={metrics.semana ?? 0}
                            icon={CalendarDaysIcon}
                        />
                        <DashboardCard
                            title="Atendidas no mês"
                            value={metrics.mes ?? 0}
                            icon={CalendarDaysIcon}
                        />
                        <DashboardCard
                            title="Atendidas no ano"
                            value={metrics.ano ?? 0}
                            icon={CalendarDaysIcon}
                        />
                        <DashboardCard
                            title="Média de tempo"
                            value={formatSeconds(metrics.media_tempo)}
                            icon={ClockIcon}
                        />
                        <DashboardCard
                            title="Horário de pico"
                            value={
                                metrics.hora_pico != null ? `${metrics.hora_pico}:00` : '-'
                            }
                            icon={ChartBarIcon}
                        />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
