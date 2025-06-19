export default function DashboardCard({ title, value, icon: Icon }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur shadow-lg p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-900 via-cyan-700 to-teal-500" />
            {Icon && <Icon className="h-6 w-6 text-teal-600 mb-4" />}
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-1 text-3xl font-bold text-gray-800">{value}</div>
        </div>
    );
}
