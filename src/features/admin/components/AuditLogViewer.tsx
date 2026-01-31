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
import { useGetAuditLogsQuery } from '../api/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { History, User as UserIcon, Activity, Clock, Shield, Database, Search, ArrowRightLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

export const AuditLogViewer = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading, error } = useGetAuditLogsQuery({ page: 1, limit: 50 });

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
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des logs d'audit.</div>;
    }

    const getActionVariant = (action: string) => {
        switch (action) {
            case 'CREATE': return 'green';
            case 'UPDATE': return 'purple';
            case 'DELETE': return 'danger';
            case 'VALIDATE': return 'blue';
            default: return 'slate';
        }
    };

    const logs = data?.data || [];
    const filteredLogs = logs.filter(log =>
        log.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        log.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(search.toLowerCase()) ||
        log.action?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" />
                        Trançabilité Système
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Journal d'Audit</h2>
                    <p className="text-slate-500 font-medium mt-1">Historique complet des actions effectuées sur la plateforme.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <History className="h-5 w-5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{logs.length} Événements récents</span>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Filtrer les événements..."
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
                                <PremiumTableHead>Initiateur</PremiumTableHead>
                                <PremiumTableHead>Action</PremiumTableHead>
                                <PremiumTableHead>Domaine / Entité</PremiumTableHead>
                                <PremiumTableHead>Détails Techniques</PremiumTableHead>
                                <PremiumTableHead className="w-[200px] text-right">Horodatage</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredLogs.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun log correspondant.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <PremiumTableRow key={log.id.toString()} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                                    <UserIcon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 uppercase text-[11px]">
                                                        {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Système Automatique'}
                                                    </div>
                                                    <div className="text-[9px] text-slate-400 font-mono tracking-tight lowercase">
                                                        IP: {log.ipAddress || '127.0.0.1'}
                                                    </div>
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={getActionVariant(log.action)}>
                                                {log.action}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[9px] font-black text-slate-600 uppercase">
                                                    {log.entityType}
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400">#{log.entityId.toString()}</span>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="max-w-[300px] truncate text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                {log.changes ? JSON.stringify(log.changes) : 'AUCUNE DONNÉE'}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <div className="text-[11px] font-bold text-slate-900 uppercase">
                                                    {format(new Date(log.timestamp), 'dd MMMM yyyy', { locale: fr })}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                                    <Clock className="h-3 w-3" /> {format(new Date(log.timestamp), 'HH:mm:ss')}
                                                </div>
                                            </div>
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
