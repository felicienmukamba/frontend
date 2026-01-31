'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Loader2 } from 'lucide-react';
import {
    useCreateStockMovementMutation,
    useUpdateStockMovementMutation,
} from '../api/resourcesApi';
import { StockMovement, CreateStockMovementDto } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetProductsQuery } from '../api/resourcesApi';
import { extractArray } from '@/lib/utils';

const stockMovementSchema = z.object({
    type: z.enum(['ENTRY', 'EXIT', 'TRANSFER', 'ADJUSTMENT']),
    movementDate: z.string().min(1),
    quantity: z.number().min(0.01),
    unitCost: z.number().min(0),
    productId: z.number().min(1),
    documentReference: z.string().optional(),
    thirdPartyId: z.number().optional(),
    fromBranchId: z.number().optional(),
    toBranchId: z.number().optional(),
});

type StockMovementFormData = z.infer<typeof stockMovementSchema>;

interface StockMovementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    stockMovementToEdit?: StockMovement | null;
}

export function StockMovementDialog({ open, onOpenChange, stockMovementToEdit }: StockMovementDialogProps) {
    const { user, companyId } = useAuth();
    const [createStockMovement, { isLoading: isCreating }] = useCreateStockMovementMutation();
    const [updateStockMovement, { isLoading: isUpdating }] = useUpdateStockMovementMutation();
    const { data: productsData } = useGetProductsQuery({});
    const products = extractArray(productsData);

    const form = useForm<StockMovementFormData>({
        resolver: zodResolver(stockMovementSchema),
        defaultValues: {
            type: 'ENTRY',
            movementDate: new Date().toISOString().split('T')[0],
            quantity: 0,
            unitCost: 0,
            productId: 0,
        },
    });

    useEffect(() => {
        if (stockMovementToEdit) {
            form.reset({
                type: stockMovementToEdit.type as any,
                movementDate: stockMovementToEdit.movementDate.split('T')[0],
                quantity: stockMovementToEdit.quantity,
                unitCost: stockMovementToEdit.unitCost,
                productId: stockMovementToEdit.productId,
                documentReference: stockMovementToEdit.documentReference,
                thirdPartyId: stockMovementToEdit.thirdPartyId,
                fromBranchId: stockMovementToEdit.fromBranchId,
                toBranchId: stockMovementToEdit.toBranchId,
            });
        } else {
            form.reset({
                type: 'ENTRY',
                movementDate: new Date().toISOString().split('T')[0],
                quantity: 0,
                unitCost: 0,
                productId: 0,
            });
        }
    }, [stockMovementToEdit, form]);

    const onSubmit = async (data: StockMovementFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateStockMovementDto = {
                ...data,
                companyId: Number(companyId),
                createdById: user?.id || 1,
            };

            if (stockMovementToEdit) {
                await updateStockMovement({ id: stockMovementToEdit.id, ...payload }).unwrap();
                toast.success('✅ Mouvement mis à jour');
            } else {
                const movementType = data.type === 'ENTRY' ? 'IN' : 'OUT';
                const accountingDesc = movementType === 'IN'
                    ? 'Dr 31 (Stock) / Cr 603 (Variation)'
                    : 'Dr 603 (Variation) / Cr 31 (Stock)';

                await createStockMovement(payload).unwrap();
                toast.success(`✅ Mouvement de stock créé`, {
                    description: `📊 Écriture OHADA auto-générée: ${accountingDesc}`
                });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{stockMovementToEdit ? 'Modifier mouvement' : 'Nouveau mouvement de stock'}</DialogTitle>
                    <DialogDescription>
                        Enregistrez une entrée, sortie ou transfert de stock
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ENTRY">Entrée</SelectItem>
                                                <SelectItem value="EXIT">Sortie</SelectItem>
                                                <SelectItem value="TRANSFER">Transfert</SelectItem>
                                                <SelectItem value="ADJUSTMENT">Ajustement</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="movementDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date *</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Produit *</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un produit" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {products.map((product: any) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} ({product.sku})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantité *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unitCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Coût unitaire *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="documentReference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Référence document</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="REF-001" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {stockMovementToEdit ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
