"use client";

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
import { MoreHorizontal, Plus, Search, User, Mail, Phone, ShieldCheck, Database, Building2, Users } from 'lucide-react';
import { useGetThirdPartiesQuery, useDeleteThirdPartyMutation } from '../api/resourcesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { ThirdPartyDialog } from './ThirdPartyDialog';
import { ThirdPartyHistoryDialog } from './ThirdPartyHistoryDialog';
import { ThirdParty, ThirdPartyType } from '../types';
import { Input } from '@/components/ui/input';
import { extractArray } from '@/lib/utils';

export const ThirdPartyList = ({ type }: { type?: ThirdPartyType }) => {
    const [search, setSearch] = useState('');
    const { data, isLoading, error } = useGetThirdPartiesQuery({
        page: 1,
        limit: 10,
        type,
        search: search || undefined
    });

    const thirdParties = extractArray<ThirdParty>(data);
    const [deleteThirdParty] = useDeleteThirdPartyMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedThirdParty, setSelectedThirdParty] = useState<ThirdParty | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyThirdPartyId, setHistoryThirdPartyId] = useState<number | null>(null);

    const handleHistory = (id: number) => {
        setHistoryThirdPartyId(id);
        setIsHistoryOpen(true);
    };

    const handleCreate = () => {
        setSelectedThirdParty(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (tp: ThirdParty) => {
        setSelectedThirdParty(tp);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce tiers ?')) {
            try {
                await deleteThirdParty(id).unwrap();
                toast.success('Tiers supprimé');
            } catch (err) {
                toast.error('Erreur lors de la suppression');
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
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des tiers.</div>;
    }

    const isSupplier = type === ThirdPartyType.SUPPLIER;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isSupplier ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-blue-50 border-blue-100 text-blue-700'} text-[10px] font-black mb-4 uppercase tracking-[0.2em]`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${isSupplier ? 'bg-orange-500' : 'bg-drc-blue'} animate-pulse`} />
                        Portefeuille Partenaires
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">
                        {isSupplier ? 'Fournisseurs' : type === ThirdPartyType.CUSTOMER ? 'Clients' : 'Tous les Tiers'}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez vos relations et coordonnées {isSupplier ? 'fournisseurs' : 'clients'}.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouveau {isSupplier ? 'Fournisseur' : 'Client'}
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par nom..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Raison Sociale</PremiumTableHead>
                                <PremiumTableHead>Type</PremiumTableHead>
                                <PremiumTableHead>Coordonnées</PremiumTableHead>
                                <PremiumTableHead>Identification</PremiumTableHead>
                                <PremiumTableHead className="w-[80px]">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {thirdParties.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        {isSupplier ? <Building2 className="h-12 w-12 mx-auto mb-4 opacity-10" /> : <Users className="h-12 w-12 mx-auto mb-4 opacity-10" />}
                                        Aucun enregistrement trouvé.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                thirdParties.map((tp) => (
                                    <PremiumTableRow key={tp.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-colors">
                                                    {tp.type === ThirdPartyType.SUPPLIER ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 uppercase">{tp.name}</div>
                                                    {tp.isVatSubject && (
                                                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase mt-1 border border-emerald-100">
                                                            <ShieldCheck className="h-2 w-2" /> Assujetti TVA
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={tp.type === ThirdPartyType.SUPPLIER ? "yellow" : "blue"}>
                                                {tp.type === ThirdPartyType.SUPPLIER ? 'Fournisseur' : 'Client'}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="space-y-1">
                                                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 uppercase tracking-tight">
                                                    <Mail className="h-3 w-3" /> {tp.email || 'N/A'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 uppercase tracking-tight">
                                                    <Phone className="h-3 w-3" /> {tp.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-bold text-slate-700 uppercase">NIF: {tp.taxId || '-'}</div>
                                                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">RCCM: {tp.rccm || '-'}</div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Dossier Tiers</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(tp)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER FICHE
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer"
                                                        onClick={() => handleHistory(tp.id)}
                                                    >
                                                        HISTORIQUE OPÉRATIONS
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        onClick={() => handleDelete(tp.id)}
                                                    >
                                                        SUPPRIMER
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </div>
            </div>
            <ThirdPartyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} thirdPartyToEdit={selectedThirdParty} />
            <ThirdPartyHistoryDialog
                open={isHistoryOpen}
                onOpenChange={setIsHistoryOpen}
                thirdPartyId={historyThirdPartyId}
            />
        </div>
    );
};
