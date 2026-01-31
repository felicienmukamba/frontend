'use client';

import { SaaSGuard } from "@/features/saas/components/SaaSGuard";
import {
    LayoutDashboard,
    Building2,
    ShieldCheck,
    Bell,
    UserCircle,
    Settings,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function SaaSLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        {
            label: "Tableau de Bord",
            href: "/saas/dashboard",
            icon: LayoutDashboard
        },
        {
            label: "Entreprises",
            href: "/saas/companies",
            icon: Building2
        },
        {
            label: "Paramètres",
            href: "/saas/settings",
            icon: Settings
        }
    ];

    return (
        <SaaSGuard>
            <div className="flex h-screen bg-slate-50/50">
                {/* Sidebar */}
                <aside className="w-72 bg-white border-r border-slate-100 flex flex-col">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-10 w-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 tracking-tighter uppercase text-xl">Milele</p>
                                <p className="text-[10px] font-black text-drc-blue uppercase tracking-[0.2em] leading-none">Global SaaS</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                    >
                                        <div className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        )}>
                                            <item.icon className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                                            )} />
                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto p-8 border-t border-slate-50">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <UserCircle className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate tracking-tight">System Admin</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Superuser</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-white/40">
                    <header className="h-20 px-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4 text-slate-400">
                            <p className="text-[10px] font-black uppercase tracking-widest">Console d'administration</p>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                {menuItems.find(m => m.href === pathname)?.label || "Administration"}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
                            </Button>
                        </div>
                    </header>

                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SaaSGuard>
    );
}
