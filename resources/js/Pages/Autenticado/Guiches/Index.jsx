import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Guiches({ guiches }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Guichês</h2>}
        >
            <Head title="Escolha o Guichê" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6 flex flex-wrap gap-4">
                        {guiches.length > 0 ? (
                            guiches.map((g) => (
                                <Link
                                    key={g.id}
                                    href={route('guiche.panel', g.numero)}
                                    className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Guichê {g.numero}
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhum guichê cadastrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}