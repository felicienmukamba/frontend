'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchema } from '../schemas';
import { useCreateProductMutation, useUpdateProductMutation } from '../api/resourcesApi';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Package, Tag, Wallet, BarChart3, QrCode, ShieldCheck, Box } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, ProductType } from '../types';

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productToEdit?: Product | null;
}

export function ProductDialog({ open, onOpenChange, productToEdit }: ProductDialogProps) {
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const isLoading = isCreating || isUpdating;

    const form = useForm<ProductSchema>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            sku: '',
            name: '',
            type: ProductType.GOODS,
            salesPriceExclTax: 0,
            purchasePriceExclTax: 0,
            currentStock: 0,
            alertStock: 0,
            barcode: '',
        },
    });

    useEffect(() => {
        if (productToEdit) {
            form.reset({
                sku: productToEdit.sku,
                name: productToEdit.name,
                type: productToEdit.type,
                salesPriceExclTax: Number(productToEdit.salesPriceExclTax || 0),
                purchasePriceExclTax: Number(productToEdit.purchasePriceExclTax || 0),
                currentStock: productToEdit.currentStock,
                alertStock: productToEdit.alertStock,
                barcode: productToEdit.barcode || '',
            });
        } else {
            form.reset({
                sku: '',
                name: '',
                type: ProductType.GOODS,
                salesPriceExclTax: 0,
                purchasePriceExclTax: 0,
                currentStock: 0,
                alertStock: 0,
                barcode: '',
            });
        }
    }, [productToEdit, form, open]);

    const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
        try {
            if (productToEdit) {
                await updateProduct({ id: productToEdit.id, ...data }).unwrap();
                toast.success('Fiche article mise à jour');
            } else {
                await createProduct(data as any).unwrap();
                toast.success('Nouvel article créé avec succès');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue lors de l’enregistrement.' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl text-slate-900">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-drc-blue/20 p-2 rounded-xl backdrop-blur-sm border border-drc-blue/30">
                                <Package className="h-5 w-5 text-drc-blue" />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-1 w-2 bg-drc-blue rounded-full" />
                                <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                                <div className="h-1 w-2 bg-drc-red rounded-full" />
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            {productToEdit ? 'ÉDITION ARTICLE' : 'NOUVEAU PRODUIT'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Gestion du catalogue et suivi des stocks en temps réel.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control as any}
                                    name="sku"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Tag className="h-3 w-3" /> Référence (SKU)
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="PROD-001" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 transition-all font-mono font-bold" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type d'article</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold">
                                                        <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                                    <SelectItem value={ProductType.GOODS} className="font-bold">BIEN (PHYSIQUE)</SelectItem>
                                                    <SelectItem value={ProductType.SERVICE} className="font-bold">SERVICE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control as any}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Désignation du produit</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ex: Ordinateur Portable HP EliteBook" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-6 pb-2">
                                <FormField
                                    control={form.control as any}
                                    name="salesPriceExclTax"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Wallet className="h-3 w-3" /> Prix Vente HT (USD)
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" step="0.01" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-black text-emerald-600" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="purchasePriceExclTax"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix Achat HT</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" step="0.01" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold text-slate-600" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Box className="h-3 w-3" /> État des Stocks
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control as any}
                                        name="currentStock"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-[10px] font-bold text-slate-500">Stock Initial</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" className="h-10 rounded-lg border-slate-200 bg-white font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="alertStock"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1">
                                                <FormLabel className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                                                    <BarChart3 className="h-3 w-3 text-drc-yellow" /> Seuil d'alerte
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" className="h-10 rounded-lg border-slate-200 bg-white font-bold text-drc-red" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control as any}
                                name="barcode"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <QrCode className="h-3 w-3" /> Code-barres (EAN)
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono" />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50 border-slate-100 transition-all"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-12 px-8 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>{productToEdit ? 'Enregistrer modif.' : 'Créer Article'}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
