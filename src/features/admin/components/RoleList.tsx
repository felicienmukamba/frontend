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
import { MoreHorizontal, Plus, Shield, Lock, Search, Database, Key } from 'lucide-react';
import { useGetRolesQuery, useDeleteRoleMutation, useDuplicateRoleMutation } from '../api/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { Role } from '@/features/auth/types';
import { RoleDialog } from './RoleDialog';
import { extractArray } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export const RoleList = () => {
    const { data, isLoading, error } = useGetRolesQuery({ page: 1, limit: 10 });
    const [deleteRole] = useDeleteRoleMutation();
    const [duplicateRole] = useDuplicateRoleMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [search, setSearch] = useState('');

    const roles = extractArray<Role>(data);

    const handleCreate = () => {
        setSelectedRole(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Supprimer ce rôle ?')) {
            try {
                await deleteRole(id).unwrap();
                toast.success('Rôle supprimé');
            } catch (err: any) {
                toast.error('Erreur', { description: err.data?.message || 'Erreur lors de la suppression' });
            }
        }
    };

    const handleDuplicate = async (id: number) => {
        try {
            await duplicateRole(id).unwrap();
            toast.success('Rôle dupliqué');
        } catch (err: any) {
            toast.error('Erreur', { description: err.data?.message || 'Erreur lors de la duplication' });
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
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des rôles.</div>;
    }

    const filteredRoles = roles.filter(role =>
        role.label?.toLowerCase().includes(search.toLowerCase()) ||
        role.code?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                        Gouvernance & Droits
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Rôles</h2>
                    <p className="text-slate-500 font-medium mt-1">Définissez les profils d'accès et les matrices de permissions.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouveau Profil
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par libellé ou code..."
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
                                <PremiumTableHead>Intitulé du Rôle</PremiumTableHead>
                                <PremiumTableHead>Code Système</PremiumTableHead>
                                <PremiumTableHead>Périmètre de Permissions</PremiumTableHead>
                                <PremiumTableHead className="w-[80px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredRoles.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={4} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun rôle configuré.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredRoles.map((role) => (
                                    <PremiumTableRow key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-all duration-300">
                                                    <Lock className="h-5 w-5" />
                                                </div>
                                                <div className="font-bold text-slate-900 uppercase">{role.label}</div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant="slate">
                                                <Key className="mr-1 h-3 w-3 inline" /> {role.code}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex flex-wrap gap-1.5 max-w-md">
                                                {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                                                    role.permissions.slice(0, 5).map((p, idx) => (
                                                        <span key={idx} className="text-[8px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md uppercase border border-slate-200 group-hover:bg-white group-hover:border-slate-100 transition-colors">
                                                            {String(p)}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-medium italic">Accès restreint par défaut</span>
                                                )}
                                                {Array.isArray(role.permissions) && role.permissions.length > 5 && (
                                                    <span className="text-[8px] font-black text-drc-blue px-1.5 py-0.5">
                                                        +{role.permissions.length - 5} AUTRES
                                                    </span>
                                                )}
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
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Droit & Accès</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(role as any)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER PRIVILÈGES
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDuplicate(role.id)}
                                                        className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer"
                                                    >
                                                        DUPLIQUER RÔLE
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        onClick={() => handleDelete(role.id)}
                                                    >
                                                        SUPPRIMER RÔLE
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
            <RoleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} roleToEdit={selectedRole as any} />
        </div>
    );
};
