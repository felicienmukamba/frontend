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
import { useGetSixColumnBalanceQuery } from '../api/accountingApi';
import { Loader2, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import React from 'react';

interface SixColumnBalanceTableProps {
    fiscalYearId: number;
}

export function SixColumnBalanceTable({ fiscalYearId }: SixColumnBalanceTableProps) {
    const { data, isLoading, error } = useGetSixColumnBalanceQuery(fiscalYearId, {
        skip: !fiscalYearId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-drc-blue mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Calcul de la balance à 6 colonnes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center font-bold">
                Une erreur est survenue lors de la génération de la balance analytique.
            </div>
        );
    }

    const lines = data?.lines || [];
    const totals = data?.totals || {
        initialDebit: 0,
        initialCredit: 0,
        movementsDebit: 0,
        movementsCredit: 0,
        finalDebit: 0,
        finalCredit: 0
    };

    if (lines.length === 0) {
        return (
            <div className="py-20 bg-slate-50/50 rounded-3xl border border-dashed text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest italic opacity-50">Aucun mouvement enregistré pour cet exercice.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white">
                <PremiumTable>
                    <PremiumTableHeader>
                        <PremiumTableRow className="bg-slate-900 border-none">
                            <PremiumTableHead rowSpan={2} className="text-white font-black uppercase text-[10px] border-r border-white/10 w-[120px]">Compte</PremiumTableHead>
                            <PremiumTableHead rowSpan={2} className="text-white font-black uppercase text-[10px] border-r border-white/10">Intitulé</PremiumTableHead>
                            <PremiumTableHead colSpan={2} className="text-white text-center font-black uppercase text-[10px] border-r border-white/10 bg-slate-800/50">Soldes Initiaux</PremiumTableHead>
                            <PremiumTableHead colSpan={2} className="text-white text-center font-black uppercase text-[10px] border-r border-white/10 bg-slate-800/30">Mouvements Période</PremiumTableHead>
                            <PremiumTableHead colSpan={2} className="text-white text-center font-black uppercase text-[10px] bg-slate-800/10">Soldes Finaux</PremiumTableHead>
                        </PremiumTableRow>
                        <PremiumTableRow className="bg-slate-900 border-none">
                            <PremiumTableHead className="text-white/70 text-right font-bold text-[9px] border-r border-white/5 uppercase">Débit</PremiumTableHead>
                            <PremiumTableHead className="text-white/70 text-right font-bold text-[9px] border-r border-white/10 uppercase">Crédit</PremiumTableHead>
                            <PremiumTableHead className="text-white/70 text-right font-bold text-[9px] border-r border-white/5 uppercase">Débit</PremiumTableHead>
                            <PremiumTableHead className="text-white/70 text-right font-bold text-[9px] border-r border-white/10 uppercase">Crédit</PremiumTableHead>
                            <PremiumTableHead className="text-white/70 text-right font-bold text-[9px] border-r border-white/5 uppercase">Débit</PremiumTableHead>
                            <PremiumTableHead className="text-white/70 text-right font-bold text-[9px] uppercase">Crédit</PremiumTableHead>
                        </PremiumTableRow>
                    </PremiumTableHeader>
                    <PremiumTableBody>
                        {lines.map((item: any) => (
                            <PremiumTableRow key={item.accountNumber} className="hover:bg-slate-50 transition-colors group">
                                <PremiumTableCell className="font-mono text-[11px] font-black text-drc-blue border-r border-slate-50">{item.accountNumber}</PremiumTableCell>
                                <PremiumTableCell className="font-bold text-slate-700 text-[11px] border-r border-slate-50 uppercase max-w-[200px] truncate">{item.accountLabel}</PremiumTableCell>

                                <PremiumTableCell className="text-right font-mono text-[10px] border-r border-slate-50 bg-slate-50/30 text-slate-500">
                                    {item.initialBalanceDebit > 0 ? formatCurrency(item.initialBalanceDebit) : '-'}
                                </PremiumTableCell>
                                <PremiumTableCell className="text-right font-mono text-[10px] border-r border-slate-100 bg-slate-50/30 text-slate-500">
                                    {item.initialBalanceCredit > 0 ? formatCurrency(item.initialBalanceCredit) : '-'}
                                </PremiumTableCell>

                                <PremiumTableCell className="text-right font-mono text-[11px] border-r border-slate-50 font-bold text-indigo-600">
                                    {item.movementsDebit > 0 ? formatCurrency(item.movementsDebit) : '-'}
                                </PremiumTableCell>
                                <PremiumTableCell className="text-right font-mono text-[11px] border-r border-slate-100 font-bold text-rose-600">
                                    {item.movementsCredit > 0 ? formatCurrency(item.movementsCredit) : '-'}
                                </PremiumTableCell>

                                <PremiumTableCell className="text-right font-mono text-[11px] border-r border-slate-50 font-black text-slate-900 bg-emerald-50/10">
                                    {item.finalBalanceDebit > 0 ? formatCurrency(item.finalBalanceDebit) : '-'}
                                </PremiumTableCell>
                                <PremiumTableCell className="text-right font-mono text-[11px] font-black text-slate-900 bg-emerald-50/10">
                                    {item.finalBalanceCredit > 0 ? formatCurrency(item.finalBalanceCredit) : '-'}
                                </PremiumTableCell>
                            </PremiumTableRow>
                        ))}
                    </PremiumTableBody>
                    <PremiumTableRow className="bg-slate-100 border-none font-black text-[10px]">
                        <PremiumTableCell colSpan={2} className="uppercase tracking-widest">TOTAUX GÉNÉRAUX</PremiumTableCell>
                        <PremiumTableCell className="text-right font-mono">{formatCurrency(totals.initialDebit)}</PremiumTableCell>
                        <PremiumTableCell className="text-right font-mono">{formatCurrency(totals.initialCredit)}</PremiumTableCell>
                        <PremiumTableCell className="text-right font-mono text-indigo-700">{formatCurrency(totals.movementsDebit)}</PremiumTableCell>
                        <PremiumTableCell className="text-right font-mono text-rose-700">{formatCurrency(totals.movementsCredit)}</PremiumTableCell>
                        <PremiumTableCell className="text-right font-mono bg-emerald-100/50">{formatCurrency(totals.finalDebit)}</PremiumTableCell>
                        <PremiumTableCell className="text-right font-mono bg-emerald-100/50">{formatCurrency(totals.finalCredit)}</PremiumTableCell>
                    </PremiumTableRow>
                </PremiumTable>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Minus className="h-5 w-5 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Variation Période</span>
                    </div>
                    <div className="text-2xl font-black text-indigo-900 font-mono">
                        {formatCurrency(totals.movementsDebit - totals.movementsCredit)}
                    </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flux Brut (Débit)</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                        {formatCurrency(totals.movementsDebit)}
                    </div>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Équilibre Final</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${Math.abs(totals.finalDebit - totals.finalCredit) < 0.1 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div className="text-lg font-black text-emerald-900 uppercase">
                            {Math.abs(totals.finalDebit - totals.finalCredit) < 0.1 ? 'BALANCÉ' : 'DÉSÉQUILIBRÉ'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
