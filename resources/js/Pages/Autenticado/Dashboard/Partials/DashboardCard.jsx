// resources/js/Pages/Autenticado/Dashboard/Partials/DashboardCard.jsx
import { clsx } from 'clsx';

export default function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div className="group relative rounded-2xl p-px transition-shadow hover:shadow-2xl">
      {/* borda com gradiente institucional */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500 opacity-20 group-hover:opacity-40" />
      {/* conteúdo em glass branco */}
      <div className="relative flex flex-col items-center justify-center rounded-[inherit] bg-white/20 backdrop-blur-md py-8 px-6 text-gray-100">
        {Icon && <Icon className="h-8 w-8 text-teal-200 mb-3" />}
        <span className="text-xs font-medium uppercase tracking-wide text-teal-100 text-center">
          {title}
        </span>
        <span className="mt-1 text-3xl font-semibold">{value}</span>
      </div>
    </div>
  );
}
