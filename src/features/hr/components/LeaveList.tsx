'use client';

import React, { useState } from 'react';
import {
    useGetLeavesQuery,
    useUpdateLeaveStatusMutation
} from '../api/hrApi';
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
    CheckCircle,
    XCircle,
    Calendar,
    Filter,
    Plus,
    Clock,
    User,
    Database,
    Search
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { extractArray } from '@/lib/utils';

import { Leave, Employee } from '../types';
import { LeaveDialog } from './LeaveDialog';

export const LeaveList = () => {
    const { data, isLoading } = useGetLeavesQuery({});
    const [updateStatus] = useUpdateLeaveStatusMutation();
    const [filter, setFilter] = useState('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState('');

    const leaves = extractArray<Leave>(data);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success(`Demande de congé ${status === 'APPROVED' ? 'approuvée' : 'rejetée'}`);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'APPROVED': return "green";
            case 'REJECTED': return "red";
            default: return "yellow";
        }
    };

    const filteredLeaves = leaves.filter((leave: Leave) => {
        const matchesFilter = filter === 'ALL' || leave.status === filter;
        const employeeName = leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}`.toLowerCase() : '';
        const matchesSearch = employeeName.includes(search.toLowerCase()) || leave.type.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

    return (
        <div className="space-y-6">
            <LeaveDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Gestion des Absences
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Registre des Congés</h2>
                    <p className="text-slate-500 font-medium mt-1">Validez et suivez les demandes d'absence du personnel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nouvelle Demande
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher un employé ou type..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${filter === f ? 'bg-white text-drc-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Employé</PremiumTableHead>
                                <PremiumTableHead>Type de Congé</PremiumTableHead>
                                <PremiumTableHead>Période</PremiumTableHead>
                                <PremiumTableHead>Durée (JRE)</PremiumTableHead>
                                <PremiumTableHead>Statut</PremiumTableHead>
                                <PremiumTableHead className="w-[120px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredLeaves.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun dossier de congé ne correspond à vos critères.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredLeaves.map((leave) => (
                                    <PremiumTableRow key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="font-bold text-slate-900 uppercase">
                                                    {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : 'N/A'}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="text-[10px] font-black text-drc-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded inline-block">
                                                {leave.type}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <Clock className="h-3 w-3 text-slate-400" />
                                                {format(new Date(leave.startDate), 'dd MMM', { locale: fr })} → {format(new Date(leave.endDate), 'dd MMM yyyy', { locale: fr })}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="font-black text-slate-900">
                                            {leave.daysRequested} <span className="text-[10px] text-slate-400">JOURS</span>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={getStatusVariant(leave.status)}>
                                                {leave.status}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            {leave.status === 'PENDING' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-lg border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500 shadow-sm"
                                                        onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                                                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-red-500/30 text-red-600 hover:bg-red-50 hover:border-red-500 shadow-sm transition-all"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </div>
            </div>
        </div>
    );
};
