'use client';

import React from 'react';
import {
    FileText,
    Info,
    CheckCircle2,
    Building2,
    Globe,
    FileCheck,
    Loader2,
    BookOpen,
    Shield
} from 'lucide-react';
import { useGetNotesAnnexesQuery } from '../api/accountingApi';
import { BadgeDRC } from '@/components/ui/PremiumTable';
import { Card, CardContent } from '@/components/ui/card';

interface NotesAnnexesViewerProps {
    fiscalYearId: number;
}

export function NotesAnnexesViewer({ fiscalYearId }: NotesAnnexesViewerProps) {
    const { data, isLoading } = useGetNotesAnnexesQuery(fiscalYearId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <Loader2 className="h-10 w-10 animate-spin text-drc-blue mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Génération des Notes Annexes...</p>
            </div>
        );
    }

    if (!data) return null;

    const { notes } = data;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Notes Header */}
            <div className="flex items-center gap-6 p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText className="h-24 w-24" />
                </div>
                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-white relative z-10">
                    <BookOpen className="h-8 w-8" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Notes Annexes (États Financiers)</h3>
                    <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        Conformité Système Comptable OHADA (SYSCOHADA)
                    </p>
                </div>
            </div>

            {/* Note 1: Identification */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">01</div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Identification de l'Entité</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-drc-blue" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raison Sociale</span>
                            </div>
                            <p className="text-sm font-black text-slate-900">{notes[0].content.name}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-drc-blue" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifiants Fiscaux</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-600">RCCM: {notes[0].content.rccm}</p>
                                <p className="text-xs font-bold text-slate-600">ID. NAT: {notes[0].content.idNat}</p>
                                <p className="text-xs font-bold text-slate-600">NIF: {notes[0].content.nif}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden text-white bg-slate-900 border-none">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-white/50">
                                <Globe className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Siège Social</span>
                            </div>
                            <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                                "{notes[0].content.address}"
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Succursales et Établissements</h5>
                    <div className="flex flex-wrap gap-3">
                        {notes[0].content.branches.map((branch: any, idx: number) => (
                            <div key={idx} className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${branch.isMain ? 'bg-drc-blue' : 'bg-slate-300'}`} />
                                <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{branch.name}</span>
                                <span className="text-[10px] font-bold text-slate-400">({branch.city})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Note 2: Référentiel */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">02</div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Référentiel Comptable</h4>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2.5rem] flex gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-emerald-900 leading-relaxed uppercase tracking-tight">
                            {notes[1].content}
                        </p>
                        <div className="mt-4 flex gap-4">
                            <BadgeDRC variant="green">ACTE UNIFORME</BadgeDRC>
                            <BadgeDRC variant="green">DROIT COMPTABLE</BadgeDRC>
                        </div>
                    </div>
                </div>
            </section>

            {/* Note 3: Méthodes */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">03</div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Méthodes Comptables & Évaluation</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {notes[2].content.map((method: string, idx: number) => (
                        <div key={idx} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-100 transition-colors">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                <Info className="h-5 w-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                {method}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Disclaimer */}
            <div className="pt-12 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Fin des Notes Structurelles • Milele ERP • Compliance DRC
                </p>
            </div>
        </div>
    );
}
