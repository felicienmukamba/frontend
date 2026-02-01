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
import { MoreHorizontal, Plus, Building2, MapPin, Phone, Mail, Search, Database, Fingerprint } from 'lucide-react';
import { useGetBranchesQuery, useDeleteBranchMutation } from '../api/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { Branch } from '../types';
import { BranchDialog } from './BranchDialog';
import { extractArray } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/lib/auth-provider';

export const BranchList = () => {
    const { isSaaSAdmin, companyId } = useAuth();
    const { data, isLoading, error } = useGetBranchesQuery({
        page: 1,
        limit: 10,
        companyId: !isSaaSAdmin ? (companyId || undefined) : undefined
    });
    const [deleteBranch] = useDeleteBranchMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [search, setSearch] = useState('');

    const branches = extractArray<Branch>(data);

    const handleCreate = () => {
        setSelectedBranch(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (branch: Branch) => {
        setSelectedBranch(branch);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Supprimer cette succursale ?')) {
            try {
                await deleteBranch(id).unwrap();
                toast.success('Succursale supprimée');
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
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des succursales.</div>;
    }

    const filteredBranches = branches.filter(branch =>
        branch.name?.toLowerCase().includes(search.toLowerCase()) ||
        branch.code?.toLowerCase().includes(search.toLowerCase()) ||
        branch.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Expansion Géographique
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Succursales</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez vos points de vente, bureaux et centres logistiques.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouvelle Succursale
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par nom, ville or code..."
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
                                <PremiumTableHead>Raison Sociale & Identifiant</PremiumTableHead>
                                <PremiumTableHead>Code Site</PremiumTableHead>
                                <PremiumTableHead>Localisation</PremiumTableHead>
                                <PremiumTableHead>Contact Officiel</PremiumTableHead>
                                <PremiumTableHead className="w-[80px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredBranches.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun site répertorié.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredBranches.map((branch) => (
                                    <PremiumTableRow key={branch.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-all duration-300">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div className="font-bold text-slate-900 uppercase">{branch.name}</div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant="slate">
                                                <Fingerprint className="mr-1 h-3 w-3 inline" /> {branch.code}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                                                    <MapPin className="h-3 w-3 text-slate-400" /> {branch.city || 'N/A'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium lowercase truncate max-w-[200px]">
                                                    {branch.address || 'Adresse non spécifiée'}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="space-y-1">
                                                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 uppercase tracking-tight">
                                                    <Phone className="h-3 w-3" /> {branch.phone || 'N/A'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 lowercase tracking-tight">
                                                    <Mail className="h-3 w-3" /> {branch.email || 'N/A'}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Pilotage Succursale</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(branch)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER FICHE
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        STATISTIQUES VENTES
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        onClick={() => handleDelete(branch.id)}
                                                    >
                                                        FERMER SITE
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
            <BranchDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} branchToEdit={selectedBranch} />
        </div>
    );
};
