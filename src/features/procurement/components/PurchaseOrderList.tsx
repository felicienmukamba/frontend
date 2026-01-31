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
import { useGetPurchaseOrdersQuery, useCancelPurchaseOrderMutation } from '../api/procurementApi';
import { PurchaseOrderDialog } from './PurchaseOrderDialog';
import { PurchaseOrder, PurchaseOrderStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Eye, Truck, FileText, Search, MoreHorizontal, Calendar, Database, ShoppingBag } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { extractArray, safeFormatDate } from '@/lib/utils';
import { PaginationControls } from '@/components/ui/pagination-controls';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

export function PurchaseOrderList() {
    const { data: ordersData, isLoading } = useGetPurchaseOrdersQuery();
    const [cancelOrder] = useCancelPurchaseOrderMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const orders = extractArray<PurchaseOrder>(ordersData);

    const handleEdit = (order: PurchaseOrder) => {
        if (order.status !== PurchaseOrderStatus.DRAFT) {
            toast.error('Seules les commandes brouillon peuvent être modifiées');
            return;
        }
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedOrder(null);
        setIsDialogOpen(true);
    };

    const handleCancel = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            try {
                await cancelOrder(id).unwrap();
                toast.success('Commande annulée');
            } catch (error) {
                toast.error("Erreur lors de l'annulation");
            }
        }
    };

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'DRAFT': return "slate";
            case 'SENT': return "blue";
            case 'PARTIALLY_RECEIVED': return "yellow";
            case 'RECEIVED': return "green";
            case 'CANCELLED': return "red";
            default: return "slate";
        }
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.supplier?.name.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedOrders = filteredOrders.slice((page - 1) * 10, page * 10);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <SkeletonHR className="h-12 w-1/3" />
                    <SkeletonHR className="h-12 w-48" />
                </div>
                <SkeletonHR className="h-64 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-drc-blue animate-pulse" />
                        Approvisionnements
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Commandes Achats</h2>
                    <p className="text-slate-500 font-medium mt-1">Pilotez vos flux d'achats et réceptions fournisseurs.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <FileText className="mr-2 h-5 w-5" /> Nouvelle Commande
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par N° ou Fournisseur..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Référence</PremiumTableHead>
                                <PremiumTableHead>Fournisseur</PremiumTableHead>
                                <PremiumTableHead>Montant Total</PremiumTableHead>
                                <PremiumTableHead>Statut</PremiumTableHead>
                                <PremiumTableHead>Livraison</PremiumTableHead>
                                <PremiumTableHead className="text-right w-[80px]">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredOrders.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-24 text-slate-400 font-medium italic">
                                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucune commande trouvée.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <PremiumTableRow key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="font-mono text-xs font-black text-drc-blue uppercase tracking-widest">
                                                {order.orderNumber}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium mt-1">
                                                Émise le {safeFormatDate(order.orderDate)}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-bold text-slate-900 uppercase">{order.supplier?.name}</div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-black text-slate-900 text-sm">
                                                {(Number(order.totalAmount) || 0).toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">{order.currency}</span>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={getStatusVariant(order.status)}>
                                                {order.status}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                <Calendar className="h-3.5 w-3.5 opacity-30" />
                                                {safeFormatDate(order.expectedDate)}
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Opération Achat</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                    <DropdownMenuItem onClick={() => handleEdit(order)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4 opacity-30" /> VOIR DÉTAILS
                                                    </DropdownMenuItem>
                                                    {order.status === 'DRAFT' && (
                                                        <DropdownMenuItem onClick={() => handleEdit(order)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4 opacity-30" /> MODIFIER BROUILLON
                                                        </DropdownMenuItem>
                                                    )}
                                                    {(order.status === 'SENT' || order.status === 'PARTIALLY_RECEIVED') && (
                                                        <DropdownMenuItem onClick={() => {/* TODO */ }} className="focus:bg-blue-50 text-drc-blue rounded-xl px-3 py-2.5 font-bold cursor-pointer">
                                                            <Truck className="mr-2 h-4 w-4 opacity-100" /> RÉCEPTIONNER
                                                        </DropdownMenuItem>
                                                    )}
                                                    {order.status === 'DRAFT' && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleCancel(order.id)}
                                                            className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        >
                                                            <Trash className="mr-2 h-4 w-4 opacity-30" /> ANNULER COMMANDE
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </div>

                <div className="mt-6 flex justify-center">
                    <PaginationControls
                        currentPage={page}
                        totalPages={Math.ceil(filteredOrders.length / 10)}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            <PurchaseOrderDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                currentOrder={selectedOrder}
            />
        </div>
    );
}

const SkeletonHR = ({ className }: { className?: string }) => (
    <div className={`bg-slate-100 animate-pulse rounded-xl ${className}`} />
);
