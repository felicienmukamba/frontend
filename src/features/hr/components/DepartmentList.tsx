'use client';

import React, { useState } from 'react';
import { useGetDepartmentsQuery, useDeleteDepartmentMutation } from '../api/hrApi';
import { toast } from 'sonner';
import {
    PremiumTable,
    PremiumTableBody,
    PremiumTableCell,
    PremiumTableHead,
    PremiumTableHeader,
    PremiumTableRow,
    BadgeDRC
} from '@/components/ui/PremiumTable';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Users,
    Briefcase,
    MoreHorizontal,
    Database,
    Search
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { extractArray } from '@/lib/utils';
import { DepartmentDialog } from './DepartmentDialog';
import { Department } from '../types';

export const DepartmentList = () => {
    const { data, isLoading, error } = useGetDepartmentsQuery({ companyId: 1 });
    const [deleteDepartment] = useDeleteDepartmentMutation();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedDept, setSelectedDept] = React.useState<Department | null>(null);
    const [search, setSearch] = React.useState('');

    const departments = extractArray<Department>(data);

    const handleAdd = () => {
        setSelectedDept(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (dept: Department) => {
        setSelectedDept(dept);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
            try {
                await deleteDepartment(id).unwrap();
                toast.success('Département supprimé');
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                        Structure Organique
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Départements</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez les pôles d'activités et directions.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleAdd}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouveau Département
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher un département..."
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
                                <PremiumTableHead>Département</PremiumTableHead>
                                <PremiumTableHead>Description</PremiumTableHead>
                                <PremiumTableHead>Manager</PremiumTableHead>
                                <PremiumTableHead>Effectif</PremiumTableHead>
                                <PremiumTableHead className="w-[80px]">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredDepartments.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun département configuré.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredDepartments.map((dept) => (
                                    <PremiumTableRow key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div className="font-bold text-slate-900 uppercase">{dept.name}</div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="max-w-xs text-xs text-slate-500 truncate">
                                            {dept.description || 'N/A'}
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="text-xs font-bold text-slate-700">Responsable ID: {dept.managerId || 'Non assigné'}</div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant="slate">UNIFORMISÉ</BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Edition</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(dept)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(dept.id)}
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
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

            <DepartmentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                department={selectedDept}
            />
        </div>
    );
};
