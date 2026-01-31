'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseOrderSchema, PurchaseOrderSchema } from '../schemas';
import { useCreatePurchaseOrderMutation, useUpdatePurchaseOrderMutation } from '../api/procurementApi';
import { useGetThirdPartiesQuery, useGetProductsQuery } from '@/features/resources/api/resourcesApi';
import { ThirdParty, Product, ThirdPartyType } from '@/features/resources/types';
import { PurchaseOrder } from '../types';
import { extractArray } from '@/lib/utils';
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
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Separator } from '@/components/ui/separator';

interface PurchaseOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentOrder?: PurchaseOrder | null;
}

export function PurchaseOrderDialog({ open, onOpenChange, currentOrder }: PurchaseOrderDialogProps) {
    const isEditMode = !!currentOrder;
    const [createOrder, { isLoading: isCreating }] = useCreatePurchaseOrderMutation();
    const [updateOrder, { isLoading: isUpdating }] = useUpdatePurchaseOrderMutation();
    const { data: suppliersData } = useGetThirdPartiesQuery({ type: ThirdPartyType.SUPPLIER }); // Fix Enum
    const { data: productsData } = useGetProductsQuery({});

    const suppliers = extractArray<ThirdParty>(suppliersData);
    const products = extractArray<Product>(productsData);

    const form = useForm<PurchaseOrderSchema>({
        resolver: zodResolver(purchaseOrderSchema) as any,
        defaultValues: {
            supplierId: 0,
            currency: 'USD',
            notes: '',
            orderDate: new Date().toISOString().split('T')[0],
            expectedDate: undefined, // Add optional field
            lines: [{ productId: 0, quantity: 1, unitPrice: 0, description: '' }],
        },
    });

    useEffect(() => {
        if (currentOrder && open) {
            form.reset({
                supplierId: currentOrder.supplierId,
                orderDate: (currentOrder.orderDate && !isNaN(new Date(currentOrder.orderDate).getTime()))
                    ? format(new Date(currentOrder.orderDate), 'yyyy-MM-dd')
                    : undefined,
                expectedDate: (currentOrder.expectedDate && !isNaN(new Date(currentOrder.expectedDate).getTime()))
                    ? format(new Date(currentOrder.expectedDate), 'yyyy-MM-dd')
                    : undefined,
                currency: currentOrder.currency,
                notes: currentOrder.notes || '',
                lines: currentOrder.lines.map(l => ({
                    productId: l.productId,
                    quantity: l.quantity,
                    unitPrice: Number(l.unitPrice),
                    description: l.description || '',
                })),
            });
        } else if (!open) {
            form.reset({
                supplierId: 0,
                currency: 'USD',
                notes: '',
                orderDate: new Date().toISOString().split('T')[0],
                expectedDate: undefined,
                lines: [{ productId: 0, quantity: 1, unitPrice: 0, description: '' }],
            });
        }
    }, [currentOrder, open, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    const watchLines = form.watch("lines");

    // Calculate total amount
    const totalAmount = useMemo(() => {
        return watchLines.reduce((sum, line) => {
            return sum + (line.quantity * line.unitPrice);
        }, 0);
    }, [watchLines]);

    const onSubmit = async (data: PurchaseOrderSchema) => {
        try {
            const payload = {
                ...data,
                orderDate: data.orderDate ? new Date(data.orderDate).toISOString() : undefined,
                expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString() : undefined,
            };

            if (isEditMode && currentOrder) {
                await updateOrder({ id: currentOrder.id, data: payload }).unwrap();
                toast.success('Commande mise à jour avec succès');
            } else {
                await createOrder(payload).unwrap();
                toast.success('Commande créée avec succès');
            }
            onOpenChange(false);
        } catch (error: any) {
            console.error('Submission error:', error);
            const errorMessage = error.data?.message || 'Vérifiez les données (Fournisseur, Lignes...)';
            toast.error('Échec de l\'enregistrement', { description: errorMessage });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Modifier la commande' : 'Nouvelle commande fournisseur'}</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous pour créer une commande d'achat.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="supplierId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fournisseur</FormLabel>
                                        <Select
                                            value={field.value ? String(field.value) : undefined}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un fournisseur" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {suppliers.map((supplier) => (
                                                    <SelectItem key={supplier.id} value={String(supplier.id)}>
                                                        {supplier.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="orderDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de commande</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value ? field.value.split('T')[0] : ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expectedDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de livraison prévue</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value ? field.value.split('T')[0] : ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Lignes de commande</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ productId: 0, quantity: 1, unitPrice: 0, description: '' })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter un produit
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30%]">Produit</TableHead>
                                        <TableHead className="w-[15%]">Quantité</TableHead>
                                        <TableHead className="w-[20%]">Prix Unitaire</TableHead>
                                        <TableHead className="w-[25%]">Total</TableHead>
                                        <TableHead className="w-[10%]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.productId`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select
                                                                value={field.value ? String(field.value) : undefined}
                                                                onValueChange={(value) => {
                                                                    field.onChange(Number(value));
                                                                    const product = products.find(p => p.id === Number(value));
                                                                    if (product) {
                                                                        form.setValue(`lines.${index}.unitPrice`, Number(product.purchasePriceExclTax || 0));
                                                                        form.setValue(`lines.${index}.description`, product.name);
                                                                    }
                                                                }}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Produit" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {products.map((product) => (
                                                                        <SelectItem key={product.id} value={String(product.id)}>
                                                                            {product.name} ({product.sku})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.unitPrice`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" step="0.01" min="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {(watchLines[index]?.quantity * watchLines[index]?.unitPrice || 0).toFixed(2)} USD
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-end p-4 bg-muted/50 rounded-lg">
                                <div className="text-right">
                                    <span className="text-muted-foreground mr-4">Total Commande:</span>
                                    <span className="text-xl font-bold">{totalAmount.toFixed(2)} USD</span>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes internes</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Instructions spéciales..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {isCreating || isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    isEditMode ? 'Mettre à jour' : 'Créer la commande'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
