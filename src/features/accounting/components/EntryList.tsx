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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, CheckCircle2, XCircle, Trash2, Search, FileText, Calendar, BookOpen, Clock, ShieldCheck, Filter, ArrowRightLeft } from 'lucide-react';
import {
    useGetEntriesQuery,
    useValidateEntryMutation,
    useSoftDeleteEntryMutation,
} from '../api/accountingApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { EntryDialog } from './EntryDialog';
import { AccountingEntry, EntryStatus } from '../types';
import { extractArray, extractMeta } from '@/lib/utils';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

export const EntryList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading, error } = useGetEntriesQuery({ page, limit: 10, search } as any);
    const [validateEntry] = useValidateEntryMutation();
    const [softDeleteEntry] = useSoftDeleteEntryMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<AccountingEntry | null>(null);

    const entries = extractArray<AccountingEntry>(data);
    const meta = extractMeta(data);

    const handleCreate = () => {
        setSelectedEntry(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (entry: AccountingEntry) => {
        setSelectedEntry(entry);
        setIsDialogOpen(true);
    };

    const handleValidate = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir valider cette écriture ? Cette action est irréversible.')) {
            try {
                await validateEntry(id).unwrap();
                toast.success('Écriture validée avec succès');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Erreur lors de la validation');
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette écriture ?')) {
            try {
                await softDeleteEntry(id).unwrap();
                toast.success('Écriture supprimée');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <Skeleton className="h-64 rounded-3xl" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des écritures.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" />
                        Pièces Comptables
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Grand Livre</h2>
                    <p className="text-slate-500 font-medium mt-1">Journalisation chronologique des flux financiers de l'entité.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouvelle Écriture
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par référence ou libellé..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-xl border-slate-100 font-bold text-slate-600 gap-2">
                        <Filter className="h-4 w-4" /> Filtres Avancés
                    </Button>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Référence & Libellé</PremiumTableHead>
                                <PremiumTableHead>Date d'Enregistrement</PremiumTableHead>
                                <PremiumTableHead>Journal Source</PremiumTableHead>
                                <PremiumTableHead>État</PremiumTableHead>
                                <PremiumTableHead className="w-[80px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {entries.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucune écriture répertoriée.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                entries.map((entry) => (
                                    <PremiumTableRow key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${entry.status === EntryStatus.VALIDATED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-mono text-[11px] font-black text-drc-blue uppercase tracking-tighter">
                                                        REF: {entry.referenceNumber}
                                                    </div>
                                                    <div className="font-bold text-slate-900 uppercase text-[12px] truncate max-w-[250px]">
                                                        {entry.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex flex-col">
                                                <div className="text-[11px] font-bold text-slate-900 uppercase">
                                                    {format(new Date(entry.entryDate), 'dd MMMM yyyy', { locale: fr })}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 uppercase">
                                                    <Clock className="h-3 w-3" /> Période: {format(new Date(entry.entryDate), 'MM/yyyy')}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                    <ArrowRightLeft className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <span className="font-black text-slate-700 text-xs">[{entry.journal?.code || 'GEN'}]</span>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={entry.status === EntryStatus.VALIDATED ? 'green' : 'slate'}>
                                                {entry.status === EntryStatus.VALIDATED ? 'TOTALEMENT VALIDÉE' : 'PROVISOIRE / BROUILLON'}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Dossier Écriture</DropdownMenuLabel>
                                                    {entry.status === EntryStatus.PROVISIONAL && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEdit(entry)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                                MODIFIER SAISIE
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleValidate(entry.id)} className="focus:bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2.5 font-black cursor-pointer">
                                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                                VALIDER & ARCHIVER
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    <DropdownMenuItem className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        IMPRIMER PIÈCE
                                                    </DropdownMenuItem>
                                                    {entry.status === EntryStatus.PROVISIONAL && (
                                                        <DropdownMenuItem
                                                            className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                            onClick={() => handleDelete(entry.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            SUPPRIMER DÉFINITIVEMENT
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </div>

                {meta && (
                    <div className="mt-6 flex justify-center">
                        <PaginationControls
                            currentPage={meta.page}
                            totalPages={meta.last_page}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
            <EntryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} entryToEdit={selectedEntry} />
        </div>
    );
};
