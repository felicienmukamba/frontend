'use client';

import React, { useState } from 'react';
import { useGetStockReceptionsQuery } from '../api/procurementApi';
import { StockReceptionDialog } from './StockReceptionDialog';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Truck, Search, Database, Calendar, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { extractArray } from '@/lib/utils';

export function StockReceptionList() {
    const { data, isLoading } = useGetStockReceptionsQuery();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState('');

    const receptions = extractArray<any>(data);

    const filteredReceptions = receptions.filter((recep) => {
        const query = search.toLowerCase();
        return (
            recep.receptionNumber?.toLowerCase().includes(query) ||
            recep.supplier?.name?.toLowerCase().includes(query) ||
            recep.documentReference?.toLowerCase().includes(query)
        );
    });

    if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-drc-blue animate-pulse" />
                        Logistique & Flux
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">STOCK</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez les réceptions et rapprochements de commandes.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Truck className="mr-2 h-5 w-5" /> Nouvelle Réception
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher (N°, Fournisseur)..."
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
                                <PremiumTableHead>RéReception N°</PremiumTableHead>
                                <PremiumTableHead>Date</PremiumTableHead>
                                <PremiumTableHead>Fournisseur</PremiumTableHead>
                                <PremiumTableHead>Réf. Document</PremiumTableHead>
                                <PremiumTableHead>Cde Liée</PremiumTableHead>
                                <PremiumTableHead className="text-right">Articles</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredReceptions.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Truck className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun bon de réception trouvé.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredReceptions.map((reception) => (
                                    <PremiumTableRow key={reception.id} className="hover:bg-slate-50/50 transition-colors">
                                        <PremiumTableCell className="font-mono text-xs font-black text-drc-blue uppercase">
                                            {reception.receptionNumber}
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <Calendar className="h-3 w-3 text-slate-400" />
                                                {format(new Date(reception.receptionDate), 'dd MMM yyyy', { locale: fr })}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-bold text-slate-900 uppercase text-xs">
                                                {reception.supplier?.name || 'Inconnu'}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                                <Tag className="h-3 w-3" /> {reception.documentReference || 'NON SPÉCIFIÉ'}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant="slate">
                                                {reception.purchaseOrder?.orderNumber || 'STOCK DIRECT'}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 font-black text-slate-900">
                                                <Package className="h-4 w-4 text-slate-300" />
                                                {reception.movements?.length || 0}
                                            </div>
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </div>
            </div>

            <StockReceptionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
