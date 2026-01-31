'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { User, LogOut, Settings, Bell, Search, Menu, LayoutDashboard } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BranchSwitcher } from './BranchSwitcher';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function AuthHeader() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getBreadcrumb = () => {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length === 0) return 'Tableau de Bord';
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
    };

    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
            {/* Left Side: Breadcrumb / Title */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden sm:flex flex-col">
                    <h1 className="text-sm font-semibold text-slate-900 leading-none mb-1">
                        {getBreadcrumb()}
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Session Active</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Branch Switcher, Global Search & User Profile */}
            <div className="flex items-center gap-4">
                {/* Branch Switcher */}
                <div className="hidden lg:block">
                    <BranchSwitcher />
                </div>
                {/* Search Bar - Premium Look */}
                <div className="hidden md:flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl w-64 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500/50 transition-all">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-transparent border-none text-sm focus:outline-none text-slate-600 w-full"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                toast.info('Recherche globale en cours de développement 🚧');
                            }
                        }}
                    />
                </div>

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                    onClick={() => toast.info('Aucune nouvelle notification 🔔')}
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>

                <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative group px-1 py-1 h-auto hover:bg-transparent">
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-800 leading-none">
                                        {isMounted ? `${user?.firstName} ${user?.lastName}` : ''}
                                    </span>
                                    <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mt-0.5">
                                        {isMounted ? (user?.roles?.[0]?.label || 'Utilisateur') : ''}
                                    </span>
                                </div>
                                <Avatar className="h-9 w-9 border-2 border-white shadow-md ring-1 ring-slate-200 group-hover:ring-purple-500/30 transition-all">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs font-bold">
                                        {isMounted ? getInitials(user?.firstName, user?.lastName) : ''}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-200/60 shadow-2xl">
                        <DropdownMenuLabel className="p-4">
                            <div className="flex flex-col space-y-2">
                                <p className="text-sm font-bold text-slate-900">
                                    {isMounted ? `${user?.firstName} ${user?.lastName}` : ''}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {isMounted ? user?.email : ''}
                                </p>
                                <div className="inline-flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold w-fit uppercase">
                                    {isMounted ? (user?.roles?.map(r => r.label).join(', ') || 'Utilisateur') : ''}
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                        <div className="p-1">
                            <DropdownMenuItem className="p-2.5 rounded-xl cursor-pointer focus:bg-slate-50">
                                <User className="mr-3 h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Mon Profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-2.5 rounded-xl cursor-pointer focus:bg-slate-50">
                                <Settings className="mr-3 h-4 w-4 text-slate-500" />
                                <span className="text-sm font-medium">Paramètres Account</span>
                            </DropdownMenuItem>
                            {isMounted && user?.isSaaSAdmin && (
                                <DropdownMenuItem
                                    onClick={() => window.location.href = '/saas'}
                                    className="p-2.5 rounded-xl cursor-pointer bg-slate-950 text-white focus:bg-slate-900 focus:text-white mt-1"
                                >
                                    <LayoutDashboard className="mr-3 h-4 w-4 text-drc-yellow" />
                                    <span className="text-sm font-bold">Plateforme SaaS</span>
                                </DropdownMenuItem>
                            )}
                        </div>
                        <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                        <div className="p-1">
                            <DropdownMenuItem onClick={logout} className="p-2.5 rounded-xl cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
                                <LogOut className="mr-3 h-4 w-4" />
                                <span className="text-sm font-bold">Déconnexion</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

