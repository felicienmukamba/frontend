'use client';

import {
    Building2,
    CheckCircle2,
    Users,
    Zap,
    Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { CompanyStats } from '../api/platformApi';
import { cn } from '@/lib/utils';

interface StatsGridProps {
    stats?: CompanyStats;
    isLoading: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
    const statsItems = [
        { label: 'Entreprises', value: stats?.totalCompanies, icon: Building2, color: 'text-drc-blue', bg: 'bg-blue-50' },
        { label: 'Activées', value: stats?.activeCompanies, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'En attente', value: stats?.pendingCompanies, icon: Zap, color: 'text-drc-yellow', bg: 'bg-amber-50' },
        { label: 'Utilisateurs Totaux', value: stats?.totalUsers, icon: Users, color: 'text-slate-900', bg: 'bg-slate-100' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statsItems.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-slate-200 transition-colors"
                >
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0", s.bg)}>
                        <s.icon className={cn("h-6 w-6", s.color)} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-tight mb-1">{s.label}</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-200" /> : s.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
