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
import { MoreHorizontal, Plus, User as UserIcon, Mail, Shield, Building, Power, Search, Database } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../api/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useUpdateUserMutation } from '../api/adminApi';
import { extractArray } from '@/lib/utils';
import React, { useState } from 'react';
import { UserDialog } from './UserDialog';
import { User } from '@/features/auth/types';
import { Input } from '@/components/ui/input';

export const UserList = () => {
    const { data, isLoading, error } = useGetUsersQuery({ page: 1, limit: 10 });
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');

    const users = extractArray<User>(data);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await updateUser({ id: user.id, isActive: !user.isActive }).unwrap();
            toast.success(`Utilisateur ${!user.isActive ? 'activé' : 'désactivé'}`);
        } catch (err) {
            toast.error('Erreur lors du changement de statut');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await deleteUser(id).unwrap();
                toast.success('Utilisateur supprimé');
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
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des utilisateurs.</div>;
    }

    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                        Sécurité & Accès
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Utilisateurs</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez les comptes utilisateurs, les accès et les permissions système.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouvel Utilisateur
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par nom ou email..."
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
                                <PremiumTableHead>Identité Collaborateur</PremiumTableHead>
                                <PremiumTableHead>Rôle Système</PremiumTableHead>
                                <PremiumTableHead>Succursale</PremiumTableHead>
                                <PremiumTableHead>Statut Compte</PremiumTableHead>
                                <PremiumTableHead className="w-[80px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredUsers.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun utilisateur trouvé.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <PremiumTableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-all duration-300">
                                                    <UserIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 uppercase">{user.firstName} {user.lastName}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 lowercase tracking-tight">
                                                        <Mail className="h-3 w-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role) => (
                                                        <BadgeDRC key={role.id} variant="purple">
                                                            <Shield className="mr-1 h-3 w-3 inline" /> {role.label || role.code}
                                                        </BadgeDRC>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 italic text-[10px]">SANS RÔLE</span>
                                                )}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase">
                                                <Building className="h-3.5 w-3.5 text-slate-300" />
                                                {user.branch?.name || 'SANS AFFECTATION'}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={user.isActive}
                                                    onCheckedChange={() => handleToggleStatus(user)}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {user.isActive ? 'ACTIF' : 'INACTIF'}
                                                </span>
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
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Fiche Utilisateur</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(user)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER RÉGLAGES
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        JOURNAL D'ACTIVITÉ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        RÉVOQUER ACCÈS
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
            <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} userToEdit={selectedUser} />
        </div>
    );
};
