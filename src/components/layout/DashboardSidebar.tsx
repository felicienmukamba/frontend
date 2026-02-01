'use client';

import {
    LayoutDashboard,
    Users,
    Building2,
    ShieldCheck,
    GitBranch,
    History,
    Settings,
    GraduationCap,
    Package,
    Briefcase,
    ShoppingCart,
    FileText,
    RefreshCw,
    DollarSign,
    Percent,
    ChevronLeft,
    ChevronRight,
    PieChart,
    BookOpen,
    Calculator,
    Activity,
    AppWindow,
    Truck,
    Menu
} from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { UserRole } from '@/features/auth/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { PERMISSIONS } from '@/features/auth/lib/permissions';

interface SidebarItem {
    label: string;
    href: string;
    icon: any;
}

interface SidebarModule {
    name: string;
    icon: any;
    roles?: UserRole[];
    requiredPermission?: string;
    items: SidebarItem[];
}

const menuModules: SidebarModule[] = [
    {
        name: 'Principal',
        icon: LayoutDashboard,
        items: [
            {
                label: 'Vue d\'ensemble',
                href: '/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        name: 'Comptabilité',
        icon: BookOpen,
        requiredPermission: PERMISSIONS.ACCOUNTS_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.COMPTABLE, UserRole.DIRECTEUR_FINANCIER],
        items: [
            { label: 'Tableau de Bord', href: '/accounting', icon: LayoutDashboard },
            { label: 'Plan Comptable', href: '/accounting/accounts', icon: BookOpen },
            { label: 'Écritures', href: '/accounting/entries', icon: Calculator },
            { label: 'Journaux', href: '/accounting/journals', icon: Activity },
            { label: 'États Financiers', href: '/accounting/reports', icon: PieChart },
        ],
    },
    {
        name: 'Ventes',
        icon: ShoppingCart,
        requiredPermission: PERMISSIONS.INVOICES_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.ADMIN_BRANCH, UserRole.GERANT, UserRole.CAISSIER],
        items: [
            { label: 'Factures', href: '/sales/invoices', icon: FileText },
            { label: 'Paiements', href: '/sales/payments', icon: DollarSign },
            { label: 'Clients', href: '/sales/customers', icon: Users },
            { label: 'Fournisseurs', href: '/sales/suppliers', icon: Building2 },
        ],
    },
    {
        name: 'Achats',
        icon: ShoppingCart,
        requiredPermission: PERMISSIONS.THIRD_PARTIES_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.GERANT, UserRole.COMPTABLE],
        items: [
            { label: 'Commandes', href: '/procurement/purchase-orders', icon: FileText },
            { label: 'Réceptions', href: '/procurement/stock-receptions', icon: Truck },
        ],
    },
    {
        name: 'Stock',
        icon: Package,
        requiredPermission: PERMISSIONS.PRODUCTS_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.GERANT, UserRole.ADMIN_BRANCH],
        items: [
            { label: 'Inventaire', href: '/resources/inventory', icon: Package },
        ],
    },
    {
        name: 'RH & Paye',
        icon: GraduationCap,
        requiredPermission: PERMISSIONS.HR_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.RH],
        items: [
            { label: 'Employés', href: '/hr/employees', icon: Users },
            { label: 'Départements', href: '/hr/departments', icon: Briefcase },
            { label: 'Paie', href: '/hr/payroll', icon: DollarSign },
            { label: 'Congés', href: '/hr/leaves', icon: FileText },
            { label: 'Présences', href: '/hr/attendance', icon: Activity },
            { label: 'Formations', href: '/hr/training', icon: GraduationCap },
        ],
    },
    {
        name: 'Administration',
        icon: ShieldCheck,
        requiredPermission: PERMISSIONS.ROLES_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.ADMIN_BRANCH],
        items: [
            { label: 'Utilisateurs', href: '/admin/users', icon: Users },
            { label: 'Rôles & Accès', href: '/admin/roles', icon: ShieldCheck },
            { label: 'Succursales', href: '/admin/branches', icon: GitBranch },
            { label: 'Journal d\'Audit', href: '/admin/audit-logs', icon: History },
            { label: 'Paramètres', href: '/admin/settings', icon: Settings },
        ],
    },
    {
        name: 'Système',
        icon: RefreshCw,
        requiredPermission: PERMISSIONS.COMPANY_SETTINGS,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY],
        items: [
            { label: 'DGI (Fiscalité)', href: '/dgi/taxes', icon: Percent },
        ],
    },
    {
        name: 'Budgets',
        icon: Calculator,
        requiredPermission: PERMISSIONS.BUDGETS_READ,
        roles: [UserRole.SUPERADMIN, UserRole.ADMIN_COMPANY, UserRole.DIRECTEUR_FINANCIER, UserRole.COMPTABLE],
        items: [
            { label: 'Budgets Annuels', href: '/budgeting', icon: Calculator },
        ],
    },
    {
        name: 'SaaS Administration',
        icon: AppWindow,
        items: [
            { label: 'Tableau de Bord SaaS', href: '/saas/dashboard', icon: LayoutDashboard },
            { label: 'Gestion Entreprises', href: '/saas/companies', icon: Building2 },
        ],
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { hasRole, hasPermission, isSuperAdmin, user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Persist collapsed state - load from localStorage after mount
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const storedCollapsed = localStorage.getItem('sidebar-collapsed');
            if (storedCollapsed) setIsCollapsed(storedCollapsed === 'true');
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-collapsed', String(newState));
        }
    };

    const canAccessModule = (module: SidebarModule) => {
        if (isSuperAdmin) return true;
        if (module.name === 'SaaS Administration') return !!user?.isSaaSAdmin;

        // Priority to specific permission check
        if (module.requiredPermission) {
            return hasPermission(module.requiredPermission);
        }

        // Fallback to legacy role check
        if (!module.roles) return true;
        return module.roles.some((role) => hasRole(role));
    };

    const isActive = (href: string) => {
        return pathname === href || pathname?.startsWith(href + '/');
    };

    return (
        <aside
            className={cn(
                "bg-white text-slate-500 h-full flex flex-col border-r border-slate-100 shrink-0 transition-all duration-500 ease-in-out relative z-30 shadow-sm",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "flex items-center h-20 px-6 border-b border-slate-50",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                <div className={cn("flex items-center gap-3 transition-opacity duration-500", isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}>
                    <div className="bg-drc-blue p-2 rounded-xl shadow-lg shadow-blue-500/10 ring-1 ring-white/20">
                        <Image src="/icon.png" alt="Logo" width={24} height={24} className="w-auto h-auto" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight text-xl leading-none">MILELE</span>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1 w-2 bg-drc-blue rounded-full" />
                            <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                            <div className="h-1 w-2 bg-drc-red rounded-full" />
                        </div>
                    </div>
                </div>
                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapse}
                        className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 h-8 w-8 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                {isCollapsed && (
                    <div
                        className="bg-drc-blue p-2.5 rounded-xl shadow-lg shadow-blue-500/10 ring-1 ring-white/10 cursor-pointer hover:scale-105 transition-transform"
                        onClick={toggleCollapse}
                    >
                        <Menu className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation Body */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 scrollbar-hide py-8">
                {menuModules.map((module) => (
                    canAccessModule(module) && (
                        <div key={module.name} className="space-y-2">
                            {!isCollapsed && (
                                <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    {module.name}
                                </h3>
                            )}

                            <div className="space-y-1">
                                {module.items.map((item) => (
                                    <Tooltip key={item.href}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "group flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden",
                                                    isActive(item.href)
                                                        ? "text-drc-blue bg-blue-50/50 shadow-sm"
                                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                                    isActive(item.href)
                                                        ? "text-drc-blue"
                                                        : "text-slate-400 group-hover:text-slate-600"
                                                )} />

                                                <span className={cn(
                                                    "truncate transition-all duration-500",
                                                    isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"
                                                )}>
                                                    {item.label}
                                                </span>

                                                {/* Active Indicator (DRC styled) */}
                                                {isActive(item.href) && (
                                                    <motion.div
                                                        layoutId="sidebar-active"
                                                        className="absolute left-0 top-3 bottom-3 w-1 bg-drc-blue rounded-r-full"
                                                    />
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        {isCollapsed && (
                                            <TooltipContent side="right" className="bg-white border-slate-100 text-slate-900 font-bold px-4 py-2 shadow-2xl">
                                                {item.label}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </nav>

            {/* Bottom Profile Section */}
            <div className="p-4 border-t border-slate-50">
                <Link href="/dashboard/profile">
                    <div className={cn(
                        "bg-slate-50/50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100 hover:bg-slate-50 transition-all duration-300 cursor-pointer group",
                        isCollapsed ? "justify-center" : ""
                    )}>
                        <div className="relative shrink-0">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-drc-blue to-blue-700 flex items-center justify-center text-white font-black text-xs shadow-lg ring-2 ring-white overflow-hidden transform group-hover:scale-105 transition-transform">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        </div>

                        <div className={cn(
                            "flex-1 min-w-0 transition-opacity duration-500",
                            isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"
                        )}>
                            <p className="text-sm font-black text-slate-900 truncate">
                                {isMounted ? `${user?.firstName} ${user?.lastName}` : ''}
                            </p>
                            <p className="text-[10px] text-drc-blue font-bold uppercase tracking-widest truncate">
                                {isMounted ? (isSuperAdmin ? 'Administrateur' : user?.roles?.[0]?.label || 'Utilisateur') : ''}
                            </p>
                        </div>

                        {!isCollapsed && (
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </aside>
    );
}

