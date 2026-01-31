'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard,
    AlertCircle,
    Calendar,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { useGetDashboardStatsQuery } from '@/features/dashboard/api/dashboardApi';
import { useGetAuditLogsQuery } from '@/features/admin/api/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { extractArray } from '@/lib/utils';
import { FiscalYear } from '@/features/dashboard/types';
import { useGetFiscalYearsQuery } from '@/features/accounting/api/accountingApi';

export default function DashboardPage() {
    const { user } = useAuth();

    // 1. Fetch Fiscal Years to get the active one
    const { data: fiscalYearsResponse, isLoading: isLoadingFY } = useGetFiscalYearsQuery();
    const fiscalYears = extractArray<FiscalYear>(fiscalYearsResponse);
    const activeFY = fiscalYears?.find(fy => !fy.isClosed) || fiscalYears?.[0];

    // 2. Fetch Stats once we have FY and Company info
    const { data: stats, isLoading: isLoadingStats, error: statsError } = useGetDashboardStatsQuery(
        { fiscalYearId: activeFY?.id || 0, companyId: user?.companyId || 0 },
        { skip: !activeFY || !user?.companyId }
    );

    // 3. Fetch Recent Activities
    const { data: auditLogs, isLoading: isLoadingLogs } = useGetAuditLogsQuery({ limit: 5 });

    const kpiStats = [
        {
            title: 'Recettes Totales',
            value: stats ? `${stats.revenue.toLocaleString()} USD` : '0 USD',
            change: '+12%', // Mocked trend
            trend: 'up',
            icon: DollarSign,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Résultat Net',
            value: stats ? `${stats.netIncome.toLocaleString()} USD` : '0 USD',
            change: '+5%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Trésorerie',
            value: stats ? `${stats.cashOnHand.toLocaleString()} USD` : '0 USD',
            change: 'Stable',
            trend: 'up',
            icon: CreditCard,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'TVA à Payer',
            value: stats ? `${Math.abs(stats.vatToPay).toLocaleString()} USD` : '0 USD',
            change: stats?.vatToPay && stats.vatToPay < 0 ? 'Crédit' : 'Dû',
            trend: 'down',
            icon: AlertCircle,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
    ];

    if (isLoadingFY || isLoadingStats) {
        return (
            <div className="flex flex-col gap-8 p-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[400px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">
                        Bonjour, {user?.firstName} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Voici un aperçu de la situation financière de <span className="font-semibold text-purple-600">MILELE</span>.
                    </p>
                </div>
                {activeFY && (
                    <Badge variant="outline" className="w-fit py-1.5 px-3 rounded-full border-purple-200 bg-purple-50 text-purple-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Exercice {activeFY.code} ({activeFY.isClosed ? 'Clos' : 'En cours'})
                    </Badge>
                )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiStats.map((stat) => (
                    <Card key={stat.title} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</CardTitle>
                            <div className={`${stat.bgColor} ${stat.color} p-2.5 rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <Badge className={cn(
                                    "rounded-full px-2 py-0 border-none shadow-none text-[10px] font-bold",
                                    stat.trend === 'up' ? "bg-emerald-100/80 text-emerald-700" : "bg-red-100/80 text-red-700"
                                )}>
                                    {stat.change}
                                </Badge>
                                <span className="text-slate-400 font-medium italic">vs période précédente</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                {/* Recent Activity Card */}
                <Card className="border-none shadow-sm rounded-3xl bg-white ring-1 ring-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-slate-900">Activités Récentes</CardTitle>
                            <p className="text-xs text-slate-400">Dernières actions effectuées sur le système</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-600 font-bold hover:bg-purple-50">Voir tout</Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {isLoadingLogs ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                                </div>
                            ) : (auditLogs?.data || []).length === 0 ? (
                                <div className="text-center py-12 text-slate-400 text-sm">Aucune activité enregistrée.</div>
                            ) : (
                                auditLogs?.data.map((log) => (
                                    <div key={log.id} className="flex items-start gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                            <Activity className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5">
                                                {log.action.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate italic">
                                                Sur l'entité <span className="font-semibold text-slate-700">{log.entityType}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                {format(new Date(log.timestamp), 'HH:mm', { locale: fr })}
                                            </span>
                                            <p className="text-[9px] text-slate-300 font-medium">
                                                {format(new Date(log.timestamp), 'dd MMM', { locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance / Quick View Card */}
                <Card className="border-none shadow-sm rounded-3xl bg-white ring-1 ring-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-slate-900">Analyse de Performance</CardTitle>
                            <p className="text-xs text-slate-400">Résumé des ratios clés financiers</p>
                        </div>
                        <Activity className="h-5 w-5 text-slate-300" />
                    </CardHeader>
                    <CardContent className="pt-8">
                        {stats ? (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-600">Ratio de Liquidité Courante</span>
                                        <span className="text-lg font-black text-slate-900">{stats.ratios.currentRatio}</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(stats.ratios.currentRatio * 50, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                        Un ratio supérieur à 1.0 indique que l'entreprise peut couvrir ses dettes à court terme.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-600">Marge Nette (%)</span>
                                        <span className="text-lg font-black text-slate-900">{stats.ratios.netMargin}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(stats.ratios.netMargin, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-600">Ratio d'Endettement</span>
                                        <span className="text-lg font-black text-slate-900">{stats.ratios.debtRatio}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(stats.ratios.debtRatio, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <Activity className="h-8 w-8 text-slate-200" />
                                </div>
                                <p className="text-sm text-slate-400 max-w-[200px]">
                                    Données financières insuffisantes pour générer l'analyse.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Utility function duplicated for this file to avoid import issues while refactoring
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

