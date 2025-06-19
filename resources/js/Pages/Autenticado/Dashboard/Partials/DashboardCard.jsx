export default function DashboardCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2 text-2xl font-bold text-gray-800">{value}</div>
        </div>
    );
}