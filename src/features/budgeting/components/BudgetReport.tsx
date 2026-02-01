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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BudgetExecution } from '../types';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle2, Target } from 'lucide-react';
import { BudgetVsActualChart } from './BudgetVsActualChart';

interface BudgetReportProps {
    data: BudgetExecution;
    currency?: string;
}

export const BudgetReport = ({ data, currency = 'USD' }: BudgetReportProps) => {

    const getVarianceColor = (variance: number, percentage: number) => {
        if (variance < 0) return 'text-red-600';
        if (percentage > 90) return 'text-amber-600';
        return 'text-emerald-600';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage > 100) return 'h-2 rounded-full bg-red-500';
        if (percentage > 85) return 'h-2 rounded-full bg-amber-500';
        return 'h-2 rounded-full bg-emerald-500';
    };

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2rem] border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="h-16 w-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Budget Total Prévu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black font-outfit uppercase">{formatCurrency(data.totalPlanned, currency)}</div>
                        <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-wider">
                            Objectif global de dépenses
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Réalisé (Dépensé)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black font-outfit text-slate-900 uppercase">{formatCurrency(data.totalActual, currency)}</div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                            <div
                                className={getProgressColor((data.totalActual / data.totalPlanned) * 100)}
                                style={{ width: `${Math.min((data.totalActual / data.totalPlanned) * 100, 100)}%` }}

                            />
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-3 uppercase tracking-wider flex items-center justify-between">
                            Absorption: <span>{((data.totalActual / data.totalPlanned) * 100).toFixed(1)}%</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className={`rounded-[2rem] border-none shadow-2xl relative overflow-hidden group ${data.variance < 0 ? 'bg-red-50 text-red-900' : 'bg-emerald-50 text-emerald-900'}`}>
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        {data.variance < 0 ? <AlertTriangle className="h-16 w-16" /> : <CheckCircle2 className="h-16 w-16" />}
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] ${data.variance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>Solde Disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black font-outfit uppercase">
                            {formatCurrency(data.variance, currency)}
                        </div>
                        <p className="text-[10px] font-bold mt-2 uppercase tracking-wider">
                            {data.variance < 0 ? 'Dépassement critique' : 'Reste à allouer/dépenser'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <BudgetVsActualChart data={data.details.map(d => ({
                name: d.accountLabel,
                budget: d.planned,
                actual: d.actual
            }))} />

            {/* Detailed Execution Table */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="mb-6">
                    <h3 className="text-lg font-black font-outfit uppercase tracking-tight text-slate-900">Analyse de Performance Budgétaire</h3>
                    <p className="text-xs text-slate-500 font-medium">Suivi granulaire des écarts par imputation comptable.</p>
                </div>

                <PremiumTable>
                    <PremiumTableHeader>
                        <PremiumTableRow className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">
                            <PremiumTableHead>Compte Imputation</PremiumTableHead>
                            <PremiumTableHead className="text-right">Prévision</PremiumTableHead>
                            <PremiumTableHead className="text-right">Réalisation</PremiumTableHead>
                            <PremiumTableHead className="text-right">Écart Absolu</PremiumTableHead>
                            <PremiumTableHead className="text-right">Statut</PremiumTableHead>
                        </PremiumTableRow>
                    </PremiumTableHeader>
                    <PremiumTableBody>
                        {data.details.map((line) => (
                            <PremiumTableRow key={line.accountId} className="group transition-colors hover:bg-slate-50/50 border-slate-50">
                                <PremiumTableCell className="py-4">
                                    <div className="font-black text-slate-900 uppercase text-xs tracking-tight">{line.accountNumber}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{line.accountLabel}</div>
                                </PremiumTableCell>
                                <PremiumTableCell className="text-right font-bold text-slate-600 text-xs">
                                    {formatCurrency(line.planned, currency)}
                                </PremiumTableCell>
                                <PremiumTableCell className="text-right font-black text-slate-900 text-xs">
                                    {formatCurrency(line.actual, currency)}
                                </PremiumTableCell>
                                <PremiumTableCell className={`text-right font-black text-xs ${line.variance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {formatCurrency(line.variance, currency)}
                                    <div className="text-[10px] opacity-70">({line.variancePercentage.toFixed(1)}%)</div>
                                </PremiumTableCell>
                                <PremiumTableCell className="text-right">
                                    {line.variancePercentage > 100 ? (
                                        <BadgeDRC variant="red" className="animate-pulse">OVER-BUDGET</BadgeDRC>
                                    ) : line.variancePercentage > 85 ? (
                                        <BadgeDRC variant="yellow">CRITICAL</BadgeDRC>
                                    ) : (
                                        <BadgeDRC variant="blue">ON-TRACK</BadgeDRC>
                                    )}
                                </PremiumTableCell>
                            </PremiumTableRow>
                        ))}
                        {data.details.length === 0 && (
                            <PremiumTableRow>
                                <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic uppercase text-[10px] tracking-widest">
                                    <Target className="h-10 w-10 mx-auto mb-4 opacity-5" />
                                    Aucune donnée d'exécution disponible.
                                </PremiumTableCell>
                            </PremiumTableRow>
                        )}
                    </PremiumTableBody>
                </PremiumTable>
            </div>
        </div>
    );
};
