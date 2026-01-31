"use client";

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
import { MoreHorizontal, Plus, Search, AlertTriangle, Package, BarChart3, Database, Tag, DollarSign, Layers } from 'lucide-react';
import { useGetProductsQuery, useDeleteProductMutation } from '../api/resourcesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { ProductDialog } from './ProductDialog';
import { Product, ProductType } from '../types';
import { Input } from '@/components/ui/input';
import { extractArray } from '@/lib/utils';
import { PaginationControls } from '@/components/ui/pagination-controls';

export const ProductList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useGetProductsQuery({
        page,
        limit: 10,
        search: search || undefined
    });
    const [deleteProduct] = useDeleteProductMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const products = extractArray<Product>(data);

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Produit supprimé');
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
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des produits.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Logistique & Stock
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Inventaire</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez votre catalogue de produits, services et niveaux de stock.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={handleCreate}
                >
                    <Plus className="mr-2 h-5 w-5" /> Ajouter un Article
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par SKU ou nom..."
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
                                <PremiumTableHead>Référence & Article</PremiumTableHead>
                                <PremiumTableHead>Type</PremiumTableHead>
                                <PremiumTableHead>Prix de Vente (HT)</PremiumTableHead>
                                <PremiumTableHead>État du Stock</PremiumTableHead>
                                <PremiumTableHead className="w-[80px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {products.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Package className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun article répertorié.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                products.map((product) => (
                                    <PremiumTableRow key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-all duration-300">
                                                    <Tag className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 uppercase">{product.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono tracking-tight lowercase">
                                                        SKU: {product.sku}
                                                    </div>
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={product.type === ProductType.GOODS ? 'blue' : 'purple'}>
                                                {product.type === ProductType.GOODS ? 'BIEN MATÉRIEL' : 'PRESTATION'}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-1.5 font-black text-slate-900">
                                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                                {Number(product.salesPriceExclTax).toLocaleString()}
                                                <span className="text-[10px] text-slate-400 font-medium ml-1">USD</span>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-12 rounded-full overflow-hidden bg-slate-100`}>
                                                    <div
                                                        className={`h-full ${(product.currentStock || 0) <= (product.alertStock || 0) ? "bg-red-500" : "bg-emerald-500"}`}
                                                        style={{ width: `${Math.min(100, ((product.currentStock || 0) / ((product.alertStock || 1) * 2)) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-tight ${(product.currentStock || 0) <= (product.alertStock || 0) ? "text-red-500" : "text-emerald-500"}`}>
                                                    {product.currentStock || 0} UNI.
                                                </span>
                                                {(product.currentStock || 0) <= (product.alertStock || 0) && product.type === ProductType.GOODS && (
                                                    <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center">
                                                        <AlertTriangle className="h-3 w-3 text-red-600 animate-pulse" />
                                                    </div>
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
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Gestion Article</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(product)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER FICHE
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer"
                                                        onClick={() => {
                                                            const printWindow = window.open('', '_blank', 'width=400,height=300');
                                                            if (printWindow) {
                                                                printWindow.document.write(`
                                                                    <html>
                                                                        <head><title>Code-barre ${product.name}</title></head>
                                                                        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; font-family:sans-serif;">
                                                                            <h2 style="margin:0 0 10px 0; text-transform:uppercase;">${product.name}</h2>
                                                                            <div style="border: 2px solid black; padding: 20px; font-size: 24px; font-weight:bold; letter-spacing: 4px;">
                                                                                ${product.barcode || product.sku}
                                                                            </div>
                                                                            <p style="margin:10px 0 0 0; color:#555;">${Number(product.salesPriceExclTax).toLocaleString()} USD</p>
                                                                            <script>window.print();</script>
                                                                        </body>
                                                                    </html>
                                                                `);
                                                                printWindow.document.close();
                                                            }
                                                        }}
                                                    >
                                                        IMPRIMER CODE-BARRE
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MOUVEMENTS STOCK
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        SUPPRIMER ARTICLE
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

                {!Array.isArray(data) && data?.meta && (
                    <div className="mt-6 flex justify-center">
                        <PaginationControls
                            currentPage={data.meta.page}
                            totalPages={data.meta.last_page}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
            <ProductDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} productToEdit={selectedProduct} />
        </div>
    );
};
