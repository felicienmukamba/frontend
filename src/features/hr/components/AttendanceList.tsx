'use client';

import React, { useState } from 'react';
import { useGetAttendancesQuery } from '../api/hrApi';
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
    Activity,
    Calendar,
    Search,
    UserCheck,
    Clock,
    User,
    Database
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { extractArray } from '@/lib/utils';
import { AttendanceDialog } from './AttendanceDialog';

export const AttendanceList = () => {
    const { data, isLoading } = useGetAttendancesQuery({});
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const attendances = extractArray<any>(data);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'PRESENT': return "green";
            case 'LATE': return "yellow";
            case 'ABSENT': return "red";
            case 'LEAVE': return "blue";
            default: return "slate";
        }
    };

    const filteredAttendances = attendances.filter((record: any) => {
        const employeeName = record.employee ? `${record.employee.firstName} ${record.employee.lastName}`.toLowerCase() : '';
        return employeeName.includes(search.toLowerCase());
    });

    if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

    return (
        <div className="space-y-6">
            <AttendanceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Pointage Quotidien
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Registre des Présences</h2>
                    <p className="text-slate-500 font-medium mt-1">Suivi en temps réel des flux du personnel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <UserCheck className="mr-2 h-5 w-5" /> Enregistrer un Pointage
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher un collaborateur..."
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
                                <PremiumTableHead>Collaborateur</PremiumTableHead>
                                <PremiumTableHead>Date</PremiumTableHead>
                                <PremiumTableHead>Arrivée</PremiumTableHead>
                                <PremiumTableHead>Départ</PremiumTableHead>
                                <PremiumTableHead>Statut</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredAttendances.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun pointage enregistré pour cette sélection.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredAttendances.map((record) => (
                                    <PremiumTableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="font-bold text-slate-900 uppercase">
                                                    {record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : 'N/A'}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="text-xs font-bold text-slate-600">
                                                {format(new Date(record.date), 'dd MMMM yyyy', { locale: fr })}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                                                <Clock className="h-3 w-3" />
                                                {record.checkIn || '--:--'}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                {record.checkOut || '--:--'}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={getStatusVariant(record.status)}>
                                                {record.status}
                                            </BadgeDRC>
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
