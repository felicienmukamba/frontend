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
import { useGetVATReportQuery } from '../api/accountingApi';
import { Loader2, ShieldCheck, PieChart, TrendingUp, TrendingDown, Percent, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import React from 'react';

interface VatReportViewerProps {
    fiscalYearId: number;
}

export function VatReportViewer({ fiscalYearId }: VatReportViewerProps) {
    const { data, isLoading, error } = useGetVATReportQuery(fiscalYearId, {
        skip: !fiscalYearId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-drc-blue mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Calcul des positions fiscales...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center font-bold">
                Erreur lors du calcul du rapport de TVA.
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">TVA Collectée</span>
                    </div>
                    <div className="text-3xl font-black text-indigo-900 font-mono">{formatCurrency(data.vatCollected)}</div>
                    <p className="text-[9px] font-bold text-indigo-400 uppercase leading-relaxed">Taxe collectée sur vos ventes de biens et prestations de services.</p>
                </div>

                <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">TVA Déductible</span>
                    </div>
                    <div className="text-3xl font-black text-emerald-900 font-mono">{formatCurrency(data.vatDeductible)}</div>
                    <p className="text-[9px] font-bold text-emerald-400 uppercase leading-relaxed">Taxe récupérable sur vos achats et investissements d'exploitation.</p>
                </div>

                <div className={`p-8 rounded-[2rem] border flex flex-col gap-4 shadow-xl ${data.status === 'TO_PAY' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Position Nette</span>
                    </div>
                    <div className="text-3xl font-black font-mono">{formatCurrency(Math.abs(data.vatToPay))}</div>
                    <div className="flex items-center gap-2">
                        <BadgeDRC variant={data.status === 'TO_PAY' ? 'red' : 'blue'}>
                            {data.status === 'TO_PAY' ? 'TVA À PAYER (Dette)' : 'CRÉDIT DE TVA'}
                        </BadgeDRC>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Analyse de Conformité Fiscale</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Vérification de la cohérence des comptes de l'Etat</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Nature de l'Impôt / Compte</PremiumTableHead>
                                <PremiumTableHead>Description OHADA</PremiumTableHead>
                                <PremiumTableHead className="text-right">Montant Collecté</PremiumTableHead>
                                <PremiumTableHead className="text-right">Montant Déductible</PremiumTableHead>
                                <PremiumTableHead className="text-right">Statut</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            <PremiumTableRow className="hover:bg-slate-50/30 transition-colors">
                                <PremiumTableCell className="font-mono text-drc-blue font-black py-4">443</PremiumTableCell>
                                <PremiumTableCell className="font-bold text-slate-700 uppercase text-[11px]">TVA Collectée sur Ventes (VT)</PremiumTableCell>
                                <PremiumTableCell className="text-right font-black text-slate-900 font-mono">{formatCurrency(data.vatCollected)}</PremiumTableCell>
                                <PremiumTableCell className="text-right font-black text-slate-300 font-mono">-</PremiumTableCell>
                                <PremiumTableCell className="text-right">
                                    <BadgeDRC variant="slate">CONFORME</BadgeDRC>
                                </PremiumTableCell>
                            </PremiumTableRow>
                            <PremiumTableRow className="hover:bg-slate-50/30 transition-colors">
                                <PremiumTableCell className="font-mono text-drc-blue font-black py-4">445</PremiumTableCell>
                                <PremiumTableCell className="font-bold text-slate-700 uppercase text-[11px]">TVA Déductible sur Achats (HA)</PremiumTableCell>
                                <PremiumTableCell className="text-right font-black text-slate-300 font-mono">-</PremiumTableCell>
                                <PremiumTableCell className="text-right font-black text-slate-900 font-mono">{formatCurrency(data.vatDeductible)}</PremiumTableCell>
                                <PremiumTableCell className="text-right">
                                    <BadgeDRC variant="slate">CONFORME</BadgeDRC>
                                </PremiumTableCell>
                            </PremiumTableRow>
                        </PremiumTableBody>
                    </PremiumTable>
                </div>
            </div>

            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-amber-200/50 flex items-center justify-center text-amber-700">
                    <Percent className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h5 className="font-black text-amber-900 uppercase text-xs tracking-widest">Note sur la Fiscalité Congolaise (RDC)</h5>
                    <p className="text-sm font-medium text-amber-800 leading-relaxed opacity-80">
                        La TVA à 16% doit être déclarée au plus tard le 15 du mois suivant. Ce rapport utilise les journaux de vente et d'achat validés pour simuler votre future liasse fiscale DGI. Assurez-vous d'avoir validé toutes vos écritures pour une précision optimale.
                    </p>
                </div>
            </div>
        </div>
    );
}
