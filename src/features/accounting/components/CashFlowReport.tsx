'use client';

import {
    PremiumTable,
    PremiumTableBody,
    PremiumTableCell,
    PremiumTableHead,
    PremiumTableHeader,
    PremiumTableRow,
    BadgeDRC
} from '@/components/ui/PremiumTable';
import { useGetCashFlowQuery } from '../api/accountingApi';
import { Loader2, Wallet, TrendingUp, TrendingDown, RefreshCcw, Landmark, CreditCard, PiggyBank } from 'lucide-react';
import { formatCurrency, safeFormatDate } from '@/lib/utils';
import React from 'react';

interface CashFlowReportProps {
    fiscalYearId: number;
}

export function CashFlowReport({ fiscalYearId }: CashFlowReportProps) {
    const { data, isLoading, error } = useGetCashFlowQuery(fiscalYearId, {
        skip: !fiscalYearId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-drc-blue mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Flux de trésorerie en cours de calcul...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center font-bold">
                Erreur lors de la génération du Tableau des Flux de Trésorerie (TFT).
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                        <PiggyBank className="h-5 w-5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trésorerie Initiale</span>
                    </div>
                    <div className="text-2xl font-black font-mono">{formatCurrency(data.cashBegin)}</div>
                </div>
                <div className={`p-6 rounded-[2rem] shadow-xl shadow-slate-100 border ${data.netVariation >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <RefreshCcw className={`h-5 w-5 ${data.netVariation >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${data.netVariation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Variation Nette</span>
                    </div>
                    <div className={`text-2xl font-black font-mono ${data.netVariation >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                        {data.netVariation > 0 ? '+' : ''}{formatCurrency(data.netVariation)}
                    </div>
                </div>
                <div className="col-span-1 lg:col-span-2 bg-drc-blue p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <Landmark className="h-6 w-6 text-white/50" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Position de Trésorerie Finale</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse group-hover:bg-white/20 transition-all">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-4xl font-black font-mono mt-4">{formatCurrency(data.cashEnd)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Flux d\'Exploitation', amount: data.operating, color: 'blue', icon: TrendingUp },
                    { label: 'Flux d\'Investissement', amount: data.investing, color: 'purple', icon: BarChart3 },
                    { label: 'Flux de Financement', amount: data.financing, color: 'emerald', icon: Wallet },
                ].map((item, idx) => {
                    const Icon = item.icon as any;
                    return (
                        <div key={idx} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-500`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-black text-slate-400 uppercase tracking-widest`}>{item.label}</span>
                            </div>
                            <div className={`text-2xl font-black font-mono ${item.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-1 bg-slate-900 rounded-full" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Historique des Flux Consolide (Journal de TFT)</h3>
                </div>

                <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead className="w-[120px]">Date</PremiumTableHead>
                                <PremiumTableHead>Description de l'Opération</PremiumTableHead>
                                <PremiumTableHead className="w-[150px]">Catégorie</PremiumTableHead>
                                <PremiumTableHead className="w-[120px]">Compte</PremiumTableHead>
                                <PremiumTableHead className="text-right w-[150px]">Flux Entrant</PremiumTableHead>
                                <PremiumTableHead className="text-right w-[150px]">Flux Sortant</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {data.flows.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium italic">
                                        Aucun flux monétaire identifié pour la période.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                data.flows.map((flow: any, i: number) => (
                                    <PremiumTableRow key={i} className="hover:bg-slate-50/30 transition-colors group">
                                        <PremiumTableCell className="font-bold text-slate-500 text-[11px]">
                                            {safeFormatDate(flow.date)}
                                        </PremiumTableCell>
                                        <PremiumTableCell className="font-bold text-slate-800 text-[11px] uppercase">
                                            {flow.description}
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC
                                                variant={flow.category === 'OPERATING' ? 'blue' : flow.category === 'INVESTING' ? 'purple' : 'green'}
                                            >
                                                {flow.category}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="font-mono text-[10px] text-slate-400 font-black">
                                            {flow.accountNumber}
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right font-black text-emerald-600 font-mono text-[11px]">
                                            {flow.type === 'INFLOW' ? formatCurrency(flow.amount) : '-'}
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right font-black text-red-500 font-mono text-[11px]">
                                            {flow.type === 'OUTFLOW' ? formatCurrency(flow.amount) : '-'}
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                        <PremiumTableRow className="bg-slate-900 border-none">
                            <PremiumTableCell colSpan={4} className="text-white font-black uppercase text-xs tracking-widest">Variation Nette Globale</PremiumTableCell>
                            <PremiumTableCell colSpan={2} className={`text-right font-black font-mono text-lg ${data.netVariation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {data.netVariation > 0 ? '+' : ''}{formatCurrency(data.netVariation)}
                            </PremiumTableCell>
                        </PremiumTableRow>
                    </PremiumTable>
                </div>
            </div>
        </div>
    );
}

// Internal icon for BarChart
const BarChart3 = ({ className }: { className?: string }) => (
    <TrendingUp className={className} /> // Reusing trending up as bar chart placeholder icon
);
