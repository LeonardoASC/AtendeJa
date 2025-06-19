import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DashboardCard from './Partials/DashboardCard';

function formatSeconds(total) {
    if (total === null || total === undefined) return '-';
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
}

export default function Dashboard({ metrics = {} }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard title="CPF mais frequente" value={metrics.cpf_mais_frequente || '-'} />
                    <DashboardCard title="Atendidas hoje" value={metrics.dia ?? 0} />
                    <DashboardCard title="Atendidas na semana" value={metrics.semana ?? 0} />
                    <DashboardCard title="Atendidas no mês" value={metrics.mes ?? 0} />
                    <DashboardCard title="Atendidas no ano" value={metrics.ano ?? 0} />
                    <DashboardCard title="Média de tempo" value={formatSeconds(metrics.media_tempo)} />
                    <DashboardCard title="Horário de pico" value={metrics.hora_pico !== null && metrics.hora_pico !== undefined ? `${metrics.hora_pico}:00` : '-'} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}