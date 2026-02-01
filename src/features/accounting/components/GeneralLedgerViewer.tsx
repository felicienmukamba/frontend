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
import { useGetGeneralLedgerQuery, useGetAccountsQuery } from '../api/accountingApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRightLeft, Search, Calendar, FileText, Download, Printer, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { formatCurrency, extractArray, safeFormatDate } from '@/lib/utils';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Account } from '../types';

interface GeneralLedgerViewerProps {
    fiscalYearId: number;
}

export function GeneralLedgerViewer({ fiscalYearId }: GeneralLedgerViewerProps) {
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");
    const { data: accountsData } = useGetAccountsQuery();
    const accounts = extractArray<Account>(accountsData);

    const { data, isLoading, error } = useGetGeneralLedgerQuery({
        accountId: parseInt(selectedAccountId),
        fiscalYearId
    }, {
        skip: !selectedAccountId || !fiscalYearId,
    });

    const movements = data?.movements || [];
    const totals = data?.totals || { debit: 0, credit: 0, balanceFinal: 0 };
    const accountInfo = data?.account;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                <div className="flex-1 w-full max-w-md">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block mx-1">Sélectionner un Compte</label>
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                        <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200 shadow-sm font-bold text-slate-700">
                            <SelectValue placeholder="Rechercher par numéro ou nom..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1 max-h-[300px]">
                            {accounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id.toString()} className="rounded-xl px-3 py-2.5 font-bold cursor-pointer hover:bg-slate-50">
                                    <span className="text-drc-blue mr-3 font-mono">{acc.accountNumber}</span>
                                    <span className="uppercase text-slate-600 font-black">{acc.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-bold transition-all" disabled={!selectedAccountId}>
                        <Printer className="h-4 w-4 mr-2 opacity-50" /> IMPRIMER
                    </Button>
                    <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-bold transition-all text-emerald-600" disabled={!selectedAccountId}>
                        <Download className="h-4 w-4 mr-2 opacity-50" /> EXCEL
                    </Button>
                </div>
            </div>

            {!selectedAccountId ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-20 grayscale">
                    <Search className="h-20 w-20 mb-4" />
                    <p className="text-xl font-black uppercase tracking-[0.2em]">Sélectionnez un compte pour voir le Grand Livre</p>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-drc-blue mb-4" />
                    <span className="font-bold text-slate-400 uppercase tracking-widest animate-pulse">Extraction des écritures...</span>
                </div>
            ) : error ? (
                <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center font-bold">
                    Erreur lors de la récupération des mouvements du compte.
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-drc-blue flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <ArrowRightLeft className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    {accountInfo?.code} - {accountInfo?.label}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Historique détaillé des mouvements
                                </p>
                            </div>
                        </div>
                        <div className={`px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-wider ${totals.balanceFinal >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            Solde Final: {formatCurrency(Math.abs(totals.balanceFinal))} {totals.balanceFinal >= 0 ? '(DÉBITEUR)' : '(CRÉDITEUR)'}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm bg-white">
                        <PremiumTable>
                            <PremiumTableHeader>
                                <PremiumTableRow className="bg-slate-50/50">
                                    <PremiumTableHead className="w-[120px]">Date</PremiumTableHead>
                                    <PremiumTableHead className="w-[100px]">Journal</PremiumTableHead>
                                    <PremiumTableHead className="w-[150px]">Référence</PremiumTableHead>
                                    <PremiumTableHead>Libellé de l'Écriture</PremiumTableHead>
                                    <PremiumTableHead className="text-right w-[140px]">Débit</PremiumTableHead>
                                    <PremiumTableHead className="text-right w-[140px]">Crédit</PremiumTableHead>
                                    <PremiumTableHead className="text-right w-[140px]">Solde Cumulé</PremiumTableHead>
                                </PremiumTableRow>
                            </PremiumTableHeader>
                            <PremiumTableBody>
                                {movements.length === 0 ? (
                                    <PremiumTableRow>
                                        <PremiumTableCell colSpan={7} className="text-center py-20 text-slate-400 font-medium italic">
                                            Aucun mouvement pour ce compte sur cette période.
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ) : (
                                    movements.map((m: any, idx: number) => (
                                        <PremiumTableRow key={idx} className="hover:bg-slate-50/30 transition-colors group">
                                            <PremiumTableCell className="font-bold text-slate-500 text-[11px]">
                                                {safeFormatDate(m.date)}
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <BadgeDRC variant="slate">{m.journal}</BadgeDRC>
                                            </PremiumTableCell>
                                            <PremiumTableCell className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                                                {m.reference}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="font-bold text-slate-700 text-[11px] uppercase">
                                                {m.label}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right font-black text-indigo-600 font-mono text-[11px]">
                                                {m.debit > 0 ? formatCurrency(m.debit) : '-'}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right font-black text-rose-600 font-mono text-[11px]">
                                                {m.credit > 0 ? formatCurrency(m.credit) : '-'}
                                            </PremiumTableCell>
                                            <PremiumTableCell className={`text-right font-black font-mono text-[11px] bg-slate-50/50 ${m.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                                                {formatCurrency(Math.abs(m.balance))}
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    ))
                                )}
                            </PremiumTableBody>
                            <PremiumTableRow className="bg-slate-900 border-none">
                                <PremiumTableCell colSpan={4} className="text-white font-black uppercase text-xs tracking-widest">Totaux de la Période</PremiumTableCell>
                                <PremiumTableCell className="text-right text-indigo-400 font-black font-mono">{formatCurrency(totals.debit)}</PremiumTableCell>
                                <PremiumTableCell className="text-right text-rose-400 font-black font-mono">{formatCurrency(totals.credit)}</PremiumTableCell>
                                <PremiumTableCell className={`text-right font-black font-mono ${totals.balanceFinal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {formatCurrency(Math.abs(totals.balanceFinal))}
                                </PremiumTableCell>
                            </PremiumTableRow>
                        </PremiumTable>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl shadow-indigo-200/50 flex items-center justify-center text-indigo-500">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Débit</span>
                                <div className="text-3xl font-black text-indigo-900 font-mono">{formatCurrency(totals.debit)}</div>
                            </div>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl shadow-rose-200/50 flex items-center justify-center text-rose-500">
                                <TrendingDown className="h-8 w-8" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Total Crédit</span>
                                <div className="text-3xl font-black text-rose-900 font-mono">{formatCurrency(totals.credit)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
