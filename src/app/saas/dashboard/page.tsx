'use client';

import { useGetPlatformStatsQuery } from '@/features/saas/api/platformApi';
import { StatsGrid } from '@/features/saas/components/StatsGrid';
import { ArrowUpRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


export default function SaaSOverview() {
    const { data: stats, isLoading } = useGetPlatformStatsQuery();

    return (
        <div className="space-y-10">
            {/* Hero Overview */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-outfit mb-2">Aperçu Global</h2>
                    <p className="text-slate-500 font-medium max-w-xl">
                        Statistiques en temps réel sur l'utilisation de la plateforme et les performances des tenanciers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-slate-950 text-white hover:bg-slate-900 rounded-xl h-12 px-6 font-bold shadow-xl shadow-slate-200">
                        Rapport Mensuel
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <StatsGrid stats={stats} isLoading={isLoading} />

            {/* Secondary Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <span className="bg-white/10 text-white border-0 font-black text-[9px] uppercase tracking-[0.3em] mb-6 inline-flex">Système Monitoring</span>
                        <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">Performance<br />Optimale.</h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-xs text-sm">Tous les services cloud sont opérationnels dans la région Kinshasa.</p>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-12 px-6 font-bold">
                            Statut Infrastructure
                        </Button>
                    </div>

                    <Zap className="absolute -right-20 -bottom-20 h-80 w-80 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col justify-between"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Croissance ce mois</p>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">+12.4%</h3>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-tight">Capacité Serveur</span>
                            <span className="text-slate-900 tracking-tight">64%</span>
                        </div>
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "64%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-slate-950"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Mise à jour il y a 5 min</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold", className)}>
            {children}
        </span>
    );
}
