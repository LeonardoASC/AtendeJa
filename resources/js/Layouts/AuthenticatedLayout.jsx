import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Cog8ToothIcon, UserCircleIcon, XMarkIcon, Bars3Icon, HomeIcon, DocumentTextIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const hasAnyPermission = (userPermissions, requiredPerms) => {
    if (!userPermissions) return false;
    const perms = Array.isArray(requiredPerms) ? requiredPerms : [requiredPerms];
    return perms.some(perm => userPermissions.includes(perm));
};

const NAVIGATION_LINK = [
    { route: 'dashboard', label: 'Dashboard', perms: ['ver-dashboard'], icon: HomeIcon },
    { route: 'dashboard.ranking', label: 'Ranking', perms: ['ver-dashboard'], icon: HomeIcon },
    { route: 'guiche.select', label: 'Guichês', perms: ['ver-guiche'], icon: HomeIcon },
    { route: 'senhas.index', label: 'Senhas', perms: ['ver-senhas'], icon: DocumentTextIcon },
    { route: 'senhas.telao', label: 'Telão', perms: ['ver-telao'], icon: HomeIcon },
    { route: 'atender.solicitacao', label: 'Solicitações', perms: ['ver-solicitacoes'], icon: HomeIcon },
    { route: 'relatorio.index', label: 'Relatórios', perms: ['ver-relatorios'], icon: NewspaperIcon },
    { route: 'tipo-atendimentos.index', label: 'Tipos de Atendimento', perms: ['ver-tipoAtendimento'], icon: NewspaperIcon },
    { route: 'guiches.index', label: 'Gerenciar Guichês', perms: ['ver-gerenciarGuiche'], icon: HomeIcon },
    { route: 'vouchers.index', label: 'Vouchers', perms: ['ver-voucher'], icon: DocumentTextIcon },
    {route: 'admins.index', label: 'Administradores', perms: ['ver-admin'], icon: UserCircleIcon},
    {route: 'users.index', label: 'Usuários', perms: ['ver-usuarios'], icon: UserCircleIcon},
    {route: 'roles.index', label: 'Cargos', perms: ['ver-cargos'], icon: UserCircleIcon},
];


export default function AuthenticatedLayout({ header, children }) {
    const { auth, solicitacoesPendentesCount } = usePage().props;
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

    const filtered = NAVIGATION_LINK.filter(({ label }) => label.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <a href="/" className="flex items-center">
                                    <div className="h-10 w-10 bg-white rounded mr-2 flex items-center justify-center font-bold text-blue-600">
                                        <img src="https://prevmoc.mg.gov.br/imagens/logo/logo-principal.png" alt="Logo PREVMOC" />
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className='flex items-center gap-8 sm:items-stretch sm:justify-center'>
                            {filtered.map(({ route: r, label, perms }) =>
                                hasAnyPermission(auth.permissions, perms) && (
                                    <div key={r} className="hidden text-center sm:-my-px sm:flex items-center sm:items-stretch sm:justify-between ">
                                        <NavLink
                                            href={route(r)}
                                            active={route().current(r)}
                                        >
                                            <span className="flex items-center gap-2">
                                                {label}
                                                {r === 'avaliacao-post.atender' && solicitacoesPendentesCount > 0 && (
                                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                                        {solicitacoesPendentesCount}
                                                    </span>
                                                )}
                                            </span>
                                        </NavLink>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative  flex ">
                                {hasAnyPermission(auth.permissions, ['admin.index', 'users.index', 'roles.index']) && (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-full p-3 text-sm font-medium leading-4 text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 transition"
                                            >
                                                <Cog8ToothIcon className="h-6 w-6 text-gray-500" />
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                                <div className="text-base font-medium text-gray-800">
                                                    Configurações
                                                </div>
                                                <div className="text-xs font-medium text-gray-500">
                                                    Gerencie as configurações do sistema
                                                </div>
                                            </div>
                                            <Dropdown.Link
                                                href={route('admins.index')}
                                            >
                                                Administradores
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('users.index')}
                                            >
                                                Usuarios
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('roles.index')}
                                            >
                                                Cargos
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                )}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-full p-3 text-sm font-medium leading-4 text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 transition"
                                            >
                                                <UserCircleIcon className="h-6 w-6 text-gray-500" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                            <div className="text-base font-medium text-gray-800">
                                                {user.name}
                                            </div>
                                            <div className="text-xs  font-medium text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState,)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                {showingNavigationDropdown ? <XMarkIcon className="h-6 w-6 text-gray-500" /> : <Bars3Icon className="h-6 w-6 text-gray-500" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    {filtered.map(({ route: r, icon: Icon, label, perms }) =>
                        hasAnyPermission(auth.permissions, perms) && (
                            <div key={r} className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink
                                    href={route(r)}
                                    active={route().current(r)}
                                >
                                    <span className="flex items-center justify-between w-full">
                                        <span>{label}</span>
                                        {r === 'avaliacao-post.atender' && solicitacoesPendentesCount > 0 && (
                                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full ml-2">
                                                {solicitacoesPendentesCount}
                                            </span>
                                        )}
                                    </span>
                                </ResponsiveNavLink>
                            </div>
                        ),
                    )}

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
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