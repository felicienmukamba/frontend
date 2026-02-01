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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    FileText,
    PieChart,
    BarChart3,
    Download,
    Printer,
    Table as TableIcon,
    ArrowRightLeft,
    Wallet,
    Loader2,
    Calendar,
    ChevronRight,
    Search,
    TrendingUp,
    Briefcase,
    Shield,
    ShieldCheck as ShieldCheckIcon
} from "lucide-react";
import { useGetFiscalYearsQuery, useGetBalanceSheetQuery, useGetProfitAndLossQuery } from '../api/accountingApi';
import { extractArray } from '@/lib/utils';
import { FiscalYear } from '../types';
import { TrialBalanceTable } from './TrialBalanceTable';
import { SixColumnBalanceTable } from './SixColumnBalanceTable';
import { CashFlowReport } from './CashFlowReport';
import { VatReportViewer } from './VatReportViewer';
import { NotesAnnexesViewer } from './NotesAnnexesViewer';
import { GeneralLedgerViewer } from './GeneralLedgerViewer';
import React, { useState } from 'react';

// Placeholder for actual report components
const ReportPlaceholder = ({ name }: { name: string }) => (
    <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <div className="p-5 bg-white shadow-xl rounded-2xl mb-6">
            <BarChart3 className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Rapport en Attente</h3>
        <p className="text-sm text-slate-400 font-medium text-center max-w-sm mt-3 px-6">
            Le module <span className="text-drc-blue font-bold">{name}</span> est en cours de consolidation ou les données ne sont pas encore disponibles pour l'exercice sélectionné.
        </p>
    </div>
);

// Generic Report Viewer for simple Actif/Passif or Produits/Charges
const SimpleReportViewer = ({ data, title }: { data: any, title: string }) => {
    if (!data) return <ReportPlaceholder name={title} />;

    const sections = data.sections || [];

    return (
        <div className="space-y-10">
            {sections.map((section: any, idx: number) => (
                <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-1 bg-drc-blue rounded-full" />
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{section.title}</h3>
                    </div>
                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <PremiumTable>
                            <PremiumTableHeader>
                                <PremiumTableRow className="bg-slate-50/50">
                                    <PremiumTableHead className="py-4">Rubrique / Poste Comptable</PremiumTableHead>
                                    <PremiumTableHead className="text-right py-4">Montant Exprimé (USD)</PremiumTableHead>
                                </PremiumTableRow>
                            </PremiumTableHeader>
                            <PremiumTableBody>
                                {section.items.map((item: any, i: number) => (
                                    <PremiumTableRow key={i} className="hover:bg-slate-50/30 transition-colors group">
                                        <PremiumTableCell className="font-medium text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-drc-blue transition-colors" />
                                                {item.label}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right font-black text-slate-900 font-mono">
                                            {item.amount.toLocaleString()}
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))}
                                <PremiumTableRow className="bg-slate-900 group">
                                    <PremiumTableCell className="font-black text-white uppercase tracking-wider text-xs">Total {section.title}</PremiumTableCell>
                                    <PremiumTableCell className="text-right font-black text-white font-mono text-lg">
                                        {section.total.toLocaleString()}
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            </PremiumTableBody>
                        </PremiumTable>
                    </div>
                </div>
            ))}
        </div>
    );
};

export function AccountingReports() {
    const { data: fiscalYearsData } = useGetFiscalYearsQuery();
    const fiscalYears = extractArray<FiscalYear>(fiscalYearsData);
    const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>("");

    const { data: balanceSheetData, isLoading: isLoadingBS } = useGetBalanceSheetQuery(parseInt(selectedFiscalYear), {
        skip: !selectedFiscalYear,
    });

    const { data: profitLossData, isLoading: isLoadingPL } = useGetProfitAndLossQuery(parseInt(selectedFiscalYear), {
        skip: !selectedFiscalYear,
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 pb-2">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Intelligence Financière
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-outfit uppercase">États Financiers</h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">Visualisez la santé financière de votre organisation à travers des rapports consolidés en temps réel.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 px-3 border-r border-slate-100 mr-2">
                        <Calendar className="h-5 w-5 text-drc-blue" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Période</span>
                    </div>
                    <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                        <SelectTrigger className="w-[240px] h-11 rounded-xl bg-slate-50 border-transparent focus:ring-0 focus:border-slate-200 font-bold text-slate-700">
                            <SelectValue placeholder="Choisir l'exercice fiscal" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1">
                            {fiscalYears.map((fy) => (
                                <SelectItem key={fy.id} value={fy.id.toString()} className="rounded-xl px-3 py-2.5 font-bold cursor-pointer transition-colors focus:bg-slate-50">
                                    EXERCICE {fy.code} {fy.isClosed ? '(CLÔTURÉ)' : '(OUVERT)'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-100 hover:bg-slate-50 group transition-all" title="Imprimer">
                            <Printer className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
                        </Button>
                        <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-100 hover:bg-slate-50 group transition-all font-bold text-slate-600 hover:text-slate-900" title="Télécharger PDF">
                            <Download className="h-5 w-5 mr-2 text-slate-400 group-hover:text-slate-900" /> PDF
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="balance-sheet" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100 mb-8 max-w-fit">
                    {[
                        { id: 'balance-sheet', label: 'BILAN', icon: TableIcon },
                        { id: 'profit-loss', label: 'RÉSULTAT', icon: TrendingUp },
                        { id: 'trial-balance', label: 'BALANCE', icon: BarChart3 },
                        { id: 'cash-flow', label: 'CASH-FLOW', icon: Wallet },
                        { id: 'vat', label: 'TVA', icon: ShieldCheckIcon },
                        { id: 'general-ledger', label: 'GRAND LIVRE', icon: ArrowRightLeft },
                        { id: 'notes-annexes', label: 'NOTES ANNEXES', icon: FileText },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-drc-blue data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-slate-100 text-slate-400"
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[500px]">
                    <TabsContent value="balance-sheet" className="mt-0 focus-visible:outline-none">
                        <div className="mb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Actif / Passif Consolidé</h2>
                                    <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Référentiel SYSCOHADA Révisé</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <TableIcon className="h-7 w-7 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        {!selectedFiscalYear ? (
                            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                <Search className="h-16 w-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                            </div>
                        ) : isLoadingBS ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <Loader2 className="h-12 w-12 animate-spin text-drc-blue mb-4" />
                                <span className="font-bold text-slate-400 uppercase tracking-widest animate-pulse">Extraction des données...</span>
                            </div>
                        ) : (
                            <SimpleReportViewer data={balanceSheetData?.data} title="Bilan" />
                        )}
                    </TabsContent>

                    <TabsContent value="profit-loss" className="mt-0 focus-visible:outline-none">
                        <div className="mb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Compte de Résultat</h2>
                                    <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Analyse de la Performance d'Exploitation</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <TrendingUp className="h-7 w-7 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        {!selectedFiscalYear ? (
                            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                <Search className="h-16 w-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                            </div>
                        ) : isLoadingPL ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <Loader2 className="h-12 w-12 animate-spin text-drc-blue mb-4" />
                                <span className="font-bold text-slate-400 uppercase tracking-widest animate-pulse">Calcul de performance...</span>
                            </div>
                        ) : (
                            <SimpleReportViewer data={profitLossData?.data} title="Compte de Résultat" />
                        )}
                    </TabsContent>

                    <Tabs defaultValue="trial-4" className="w-full">
                        <TabsList className="mb-6 bg-slate-50 p-1.5 rounded-xl border border-slate-100 h-auto">
                            <TabsTrigger value="trial-4" className="rounded-lg px-4 py-2 font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Balance 4 Colonnes</TabsTrigger>
                            <TabsTrigger value="trial-6" className="rounded-lg px-4 py-2 font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">Balance 6 Colonnes (OHADA)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="trial-4">
                            {selectedFiscalYear ? (
                                <TrialBalanceTable fiscalYearId={parseInt(selectedFiscalYear)} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                    <Search className="h-16 w-16 mb-4" />
                                    <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="trial-6">
                            {selectedFiscalYear ? (
                                <SixColumnBalanceTable fiscalYearId={parseInt(selectedFiscalYear)} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                    <Search className="h-16 w-16 mb-4" />
                                    <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <TabsContent value="cash-flow" className="mt-0 focus-visible:outline-none">
                        <div className="mb-8 border-b border-slate-50 pb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Tableau des Flux de Trésorerie</h2>
                                    <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Analyse Dynamique des Liquidités (TFT)</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <Wallet className="h-7 w-7 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        {selectedFiscalYear ? (
                            <CashFlowReport fiscalYearId={parseInt(selectedFiscalYear)} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                <Search className="h-16 w-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="vat" className="mt-0 focus-visible:outline-none">
                        <div className="mb-8 border-b border-slate-50 pb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Situation Fiscale (TVA)</h2>
                                    <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">DGI - Déclarations des Taxes sur la Valeur Ajoutée</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <ShieldCheckIcon className="h-7 w-7 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        {selectedFiscalYear ? (
                            <VatReportViewer fiscalYearId={parseInt(selectedFiscalYear)} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                <Search className="h-16 w-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="general-ledger" className="mt-0 focus-visible:outline-none">
                        <div className="mb-8 border-b border-slate-50 pb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Grand Livre des Comptes</h2>
                                    <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Détail chronologique des opérations par compte</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <ArrowRightLeft className="h-7 w-7 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        {selectedFiscalYear ? (
                            <GeneralLedgerViewer fiscalYearId={parseInt(selectedFiscalYear)} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                <Search className="h-16 w-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* New TabsContent for Notes Annexes */}
                    <TabsContent value="notes-annexes" className="mt-0 focus-visible:outline-none">
                        <div className="mb-8 border-b border-slate-50 pb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Notes Annexes</h2>
                                    <p className="text-slate-400 font-medium mt-1 uppercase text-xs tracking-widest">Informations complémentaires aux états financiers</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <FileText className="h-7 w-7 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        {selectedFiscalYear ? (
                            <NotesAnnexesViewer fiscalYearId={parseInt(selectedFiscalYear)} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                                <Search className="h-16 w-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">Sélectionnez un exercice pour analyser</p>
                            </div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

