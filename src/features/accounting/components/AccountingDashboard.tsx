'use client';

import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ShieldCheck,
    ArrowRightLeft,
    PieChart,
    Plus,
    FileText,
    History,
    Activity,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Loader2,
    Calendar,
    Target,
    BarChart3,
    Calculator
} from 'lucide-react';
import {
    useGetAccountingDashboardStatsQuery,
    useGetFiscalYearsQuery,
    useGetJournalsQuery
} from '../api/accountingApi';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { formatCurrency, extractArray } from '@/lib/utils';
import { BadgeDRC } from '@/components/ui/PremiumTable';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntryDialog } from './EntryDialog';
import { Journal } from '../types';

export function AccountingDashboard() {
    const { companyId } = useAuth();
    const { data: fiscalYearsData } = useGetFiscalYearsQuery();
    const { data: journalsData } = useGetJournalsQuery();

    const fiscalYears = extractArray<any>(fiscalYearsData);
    const journals = extractArray<Journal>(journalsData);

    const activeFiscalYear = (fiscalYears as any[]).find((fy: any) => !fy.isClosed) || fiscalYears[0];

    const [selectedFiscalYearId, setSelectedFiscalYearId] = React.useState<number | null>(null);
    const [isEntryDialogOpen, setIsEntryDialogOpen] = React.useState(false);
    const [entryToEdit, setEntryToEdit] = React.useState<any>(null);

    const openBilanInitial = () => {
        const openingJournal = journals.find(j => j.code === 'AN' || j.code === 'OU') || journals[0];
        setEntryToEdit({
            referenceNumber: `BILAN-INITIAL-${activeFiscalYear?.code || '2024'}`,
            entryDate: activeFiscalYear?.startDate || new Date().toISOString(),
            description: `Reports à Nouveau / Bilan Initial - Exercice ${activeFiscalYear?.code || ''}`,
            journalId: openingJournal?.id || 0,
            fiscalYearId: activeFiscalYear?.id || 0,
            currency: 'FC',
            exchangeRate: 1,
            entryLines: [
                { debit: 0, credit: 0, description: 'Capital Social (101)', accountId: 0 },
                { debit: 0, credit: 0, description: 'Résultat N-1', accountId: 0 }
            ]
        });
        setIsEntryDialogOpen(true);
    };

    const openNewEntry = () => {
        setEntryToEdit(null);
        setIsEntryDialogOpen(true);
    };

    React.useEffect(() => {
        if (activeFiscalYear && !selectedFiscalYearId) {
            setSelectedFiscalYearId(activeFiscalYear.id);
        }
    }, [activeFiscalYear, selectedFiscalYearId]);

    const { data: stats, isLoading: isLoadingStats } = useGetAccountingDashboardStatsQuery(
        { fiscalYearId: selectedFiscalYearId || activeFiscalYear?.id, companyId: Number(companyId) },
        { skip: !activeFiscalYear && !selectedFiscalYearId }
    );

    if (isLoadingStats) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                <Loader2 className="h-12 w-12 animate-spin text-drc-blue mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Chargement de la situation financière...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Fiscal Year Selector */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Cash Board</h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-drc-blue" />
                        Performance Financière & Trésorerie en Temps Réel
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="h-4 w-4 text-slate-400 ml-2" />
                    <Select
                        value={selectedFiscalYearId?.toString()}
                        onValueChange={(v) => setSelectedFiscalYearId(parseInt(v))}
                    >
                        <SelectTrigger className="w-[180px] border-none shadow-none font-black text-slate-700 focus:ring-0">
                            <SelectValue placeholder="Exercice Fiscal" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                            {fiscalYears.map((fy: any) => (
                                <SelectItem key={fy.id} value={fy.id.toString()} className="font-bold">
                                    Exercice {fy.code} {fy.isClosed ? '(Clos)' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-110">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="blue">CHIFFRE D'AFFAIRES</BadgeDRC>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(stats.revenue)}</div>
                        <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+12.4% vs mois préc.</span>
                        </div>
                    </div>
                </div>

                {/* Net Income Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="green">RÉSULTAT NET (SIM.)</BadgeDRC>
                    </div>
                    <div className="space-y-1">
                        <div className={`text-3xl font-black font-mono tracking-tight ${stats.netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {formatCurrency(stats.netIncome)}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marge Net: {stats.ratios.netMargin}%</span>
                        </div>
                    </div>
                </div>

                {/* Cash Assets */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="slate" className="bg-white/5 border-white/10 text-white">TRÉSORERIE DISPO.</BadgeDRC>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-black text-white font-mono tracking-tight">{formatCurrency(stats.cashOnHand)}</div>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="h-3 w-3" />
                            Fonds disponibles en banques et caisses
                        </p>
                    </div>
                </div>

                {/* VAT Liability */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 transition-transform group-hover:scale-110">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="yellow">DETTE FISCALE (TVA)</BadgeDRC>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(stats.vatToPay)}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Provision pour prochaine liasse</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Expense Breakdown */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <PieChart className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Répartition Charges</h4>
                    </div>

                    <div className="space-y-6">
                        {stats.expenseBreakdown.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label} (C{item.category})</span>
                                    <span className="text-sm font-black text-slate-900 font-mono">{formatCurrency(item.amount)}</span>
                                </div>
                                <Progress value={(item.amount / stats.revenue) * 100} className="h-1.5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions & Ratios */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Ratios */}
                    <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-600/20 flex flex-wrap items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BarChart3 className="h-24 w-24" />
                        </div>
                        <div className="flex gap-12 relative z-10">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Liquidité Générale</div>
                                <div className="text-4xl font-black font-mono">{stats.ratios.currentRatio}</div>
                                <div className="mt-2">
                                    <BadgeDRC className="bg-white/10 border-white/20 text-white">OPTIMAL</BadgeDRC>
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Taux d'endettement</div>
                                <div className="text-4xl font-black font-mono">{stats.ratios.debtRatio}%</div>
                                <div className="mt-2">
                                    <BadgeDRC className="bg-white/10 border-white/20 text-white">MAÎTRISÉ</BadgeDRC>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 text-indigo-200">
                                    <Target className="h-10 w-10" />
                                </div>
                                <div>
                                    <h5 className="font-black uppercase text-sm tracking-tight">Objectif Fiscal {activeFiscalYear.code}</h5>
                                    <p className="text-xs text-indigo-100 opacity-70 font-medium">Réduction des charges de structure de 5%</p>
                                </div>
                            </div>
                            <Progress value={65} className="h-2 bg-white/10" />
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-drc-blue hover:shadow-lg transition-all"
                            onClick={openNewEntry}
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-drc-blue group-hover:scale-110 transition-transform">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">Écriture Directe</h5>
                                    <p className="text-[10px] font-bold text-slate-400">Saisie manuelle rapide</p>
                                </div>
                            </div>
                            <ArrowRightLeft className="h-4 w-4 text-slate-200 group-hover:text-drc-blue transition-colors" />
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer border-indigo-100/50 hover:border-indigo-500 hover:shadow-lg transition-all"
                            onClick={openBilanInitial}
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">Bilan Initial</h5>
                                    <p className="text-[10px] font-bold text-slate-400">Saisir les reports à nouveau</p>
                                </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-200 group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </div>

                    {/* Recent Activity Mini-List */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <History className="h-5 w-5" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Dernières Opérations</h4>
                            </div>
                            <Button variant="ghost" className="text-[10px] font-black text-drc-blue uppercase tracking-widest">Voir tout</Button>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-4 -mx-4 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <Calculator className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Facture Client #FC024</p>
                                            <p className="text-[10px] font-bold text-slate-400">24 Janvier 2024 • Journal VT</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-emerald-600 font-mono">+ 1.250,00 $</div>
                                        <BadgeDRC variant="slate">VALIDÉ</BadgeDRC>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <EntryDialog
                open={isEntryDialogOpen}
                onOpenChange={setIsEntryDialogOpen}
                entryToEdit={entryToEdit}
            />
        </div>
    );
}
