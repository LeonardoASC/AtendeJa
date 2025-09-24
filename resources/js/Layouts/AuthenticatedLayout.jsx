import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { HomeIcon, NewspaperIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.admin ?? auth.user;
    const flash = usePage().props.flash || {};
    const [search, setSearch] = useState('');
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const links = [
        { route: 'dashboard', label: 'Dashboard', perm: 'ver-dashboard', icon: HomeIcon },
        { route: 'guiche.select', label: 'Guichês', perm: 'ver-guiche', icon: HomeIcon },
        { route: 'senhas.index', label: 'Senhas', perm: 'ver-senhas', icon: DocumentTextIcon },
        { route: 'senhas.telao', label: 'Telão', perm: 'ver-telao', icon: HomeIcon },
        { route: 'relatorio.index', label: 'Relatórios', perm: 'ver-relatorios', icon: NewspaperIcon },
        { route: 'tipo-atendimentos.index', label: 'Tipos de Atendimento', perm: 'ver-tipoAtendimento', icon: NewspaperIcon },
        { route: 'guiches.index', label: 'Gerenciar Guichês', perm: 'ver-gerenciarGuiche', icon: HomeIcon },
    ];

    const filtered = links.filter(
        ({ label }) => label.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <a href="/" className="flex items-center">
                                <div className="h-10 w-10 bg-white rounded mr-2 flex items-center justify-center font-bold text-blue-600">
                                    <img src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png" alt="Logo Prevmoc" />
                                </div>
                            </a>

                            <div className="hidden lg:flex items-center gap-6 ml-4 overflow-x-auto flex-1 min-w-0">
                                {filtered.map(({ route: r, label, perm }) =>
                                    auth.permissions?.includes(perm) ? (
                                        <NavLink key={r} href={route(r)} active={route().current(r)} className="whitespace-nowrap">
                                            <span>{label}</span>
                                        </NavLink>
                                    ) : null
                                )}
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-3">
                            {auth.permissions?.includes('ver-admin') && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                Sistema
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>


                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('admins.index')}>Administradores</Dropdown.Link>
                                        <Dropdown.Link href={route('users.index')}>Usuarios</Dropdown.Link>
                                        <Dropdown.Link href={route('roles.index')}>Cargos</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            )}

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            {user.name}
                                            <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((s) => !s)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' lg:hidden'}>
                    {filtered.map(({ route: r, label, perm }) =>
                        auth.permissions?.includes(perm) ? (
                            <div key={r} className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink key={r} href={route(r)} active={route().current(r)}>
                                    <span>{label}</span>
                                </ResponsiveNavLink>
                            </div>
                        ) : null
                    )}

                    {auth.permissions?.includes('ver-admin') && (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">Sistema</div>
                            </div>

                            <div className="mt-3 ml-4 space-y-1">
                                <ResponsiveNavLink href={route('admins.index')}>Administradores</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('users.index')}>Usuarios</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('roles.index')}>Cargos</ResponsiveNavLink>
                            </div>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 ml-4 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
