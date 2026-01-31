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
import { useGetPaymentsQuery } from '../api/salesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Search, Calendar, CreditCard, ExternalLink, Database } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { extractArray, safeFormatDate } from '@/lib/utils';
import { Payment } from '../types/salesTypes';

export const PaymentList = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading, error } = useGetPaymentsQuery({
        page: 1,
        limit: 20,
        search: search || undefined
    });

    const payments = extractArray<Payment>(data);

    if (isLoading) return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
    );

    if (error) return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des paiements.</div>;

    const filteredPayments = payments.filter(p =>
        p.reference?.toLowerCase().includes(search.toLowerCase()) ||
        p.invoice?.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
        p.paymentMethod?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Trésorerie & Recettes
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Paiements</h2>
                    <p className="text-slate-500 font-medium mt-1">Historique complet des règlements clients.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par référence, facture..."
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
                                <PremiumTableHead>Date Règlement</PremiumTableHead>
                                <PremiumTableHead>Référence</PremiumTableHead>
                                <PremiumTableHead>Montant</PremiumTableHead>
                                <PremiumTableHead>Mode</PremiumTableHead>
                                <PremiumTableHead>Facture</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredPayments.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Database className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun règlement trouvé.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <PremiumTableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {safeFormatDate(payment.date, 'dd MMM yyyy')}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="font-mono text-[10px] font-black text-drc-blue uppercase">
                                            {payment.reference || 'SANS RÉF.'}
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-black text-emerald-700 text-sm">
                                                {payment.amount?.toLocaleString() ?? '0'} <span className="text-[10px] text-slate-400">USD</span>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant="blue">
                                                <CreditCard className="mr-1 h-3 w-3 inline" /> {payment.paymentMethod}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-slate-500">
                                                {payment.invoice?.invoiceNumber || 'N/A'}
                                                <ExternalLink className="h-3 w-3 opacity-20" />
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
