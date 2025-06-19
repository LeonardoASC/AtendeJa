import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UserIcon, CalendarDaysIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                            value={metrics.hora_pico != null ? `${metrics.hora_pico}:00` : '-'}
                            icon={ChartBarIcon}
                        />
                    </div>

                    <section className="mt-12 rounded-2xl bg-white/70 backdrop-blur shadow-xl p-8">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Atendimentos por hora (hoje)
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hora" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="total"
                                    radius={[4, 4, 0, 0]}
                                    fill="#0d9488"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
