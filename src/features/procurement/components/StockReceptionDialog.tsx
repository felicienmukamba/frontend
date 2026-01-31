'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockReceptionSchema, StockReceptionSchema } from '../schemas';
import { useCreateStockReceptionMutation } from '../api/procurementApi';
import { useGetThirdPartiesQuery, useGetProductsQuery } from '@/features/resources/api/resourcesApi';
import { ThirdPartyType, ThirdParty, Product } from '@/features/resources/types';
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
import { Separator } from '@/components/ui/separator';

interface StockReceptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseOrder?: PurchaseOrder | null;
}

export function StockReceptionDialog({ open, onOpenChange, purchaseOrder }: StockReceptionDialogProps) {
    const [createReception, { isLoading: isCreating }] = useCreateStockReceptionMutation();
    const { data: suppliersData } = useGetThirdPartiesQuery({ type: ThirdPartyType.SUPPLIER }); // Fix Enum
    const { data: productsData } = useGetProductsQuery({});

    const suppliers = extractArray<ThirdParty>(suppliersData);
    const products = extractArray<Product>(productsData);

    const form = useForm<StockReceptionSchema>({
        resolver: zodResolver(stockReceptionSchema) as any,
        defaultValues: {
            supplierId: 0,
            documentReference: '',
            notes: '',
            purchaseOrderId: undefined, // Add optional field
            lines: [{ productId: 0, quantity: 1, unitCost: 0 }],
        },
    });

    useEffect(() => {
        if (purchaseOrder && open) {
            form.reset({
                supplierId: purchaseOrder.supplierId,
                purchaseOrderId: purchaseOrder.id,
                documentReference: '',
                notes: `Réception pour la commande ${purchaseOrder.orderNumber}`,
                lines: purchaseOrder.lines
                    .filter(l => l.receivedQuantity < l.quantity)
                    .map(l => ({
                        productId: l.productId,
                        quantity: l.quantity - l.receivedQuantity,
                        unitCost: Number(l.unitPrice),
                    })),
            });
        } else if (!open) {
            form.reset({
                supplierId: 0,
                purchaseOrderId: undefined,
                documentReference: '',
                notes: '',
                lines: [{ productId: 0, quantity: 1, unitCost: 0 }],
            });
        }
    }, [purchaseOrder, open, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    const watchLines = form.watch("lines");

    const totalAmount = useMemo(() => {
        return watchLines.reduce((sum, line) => {
            return sum + (line.quantity * line.unitCost);
        }, 0);
    }, [watchLines]);

    const onSubmit = async (data: StockReceptionSchema) => {
        try {
            await createReception(data).unwrap();
            toast.success('Réception enregistrée avec succès');
            onOpenChange(false);
        } catch (error) {
            toast.error('Une erreur est survenue lors de l\'enregistrement');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nouvelle Réception de Stock</DialogTitle>
                    <DialogDescription>
                        Enregistrez une entrée de stock manuelle ou liée à une commande.
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
                                            disabled={!!purchaseOrder}
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
                                name="documentReference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Référence Document (BL)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="BL-12345" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Articles Reçus</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ productId: 0, quantity: 1, unitCost: 0 })}
                                    disabled={!!purchaseOrder}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter un article
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Article</TableHead>
                                        <TableHead className="w-[20%]">Qté Reçue</TableHead>
                                        <TableHead className="w-[20%]">Coût Unitaire</TableHead>
                                        <TableHead className="w-[20%]">Total</TableHead>
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
                                                                        form.setValue(`lines.${index}.unitCost`, Number(product.purchasePriceExclTax || 0));
                                                                    }
                                                                }}
                                                                disabled={!!purchaseOrder}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Article" />
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
                                                    name={`lines.${index}.unitCost`}
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
                                                {(watchLines[index]?.quantity * watchLines[index]?.unitCost || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1 || !!purchaseOrder}
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
                                    <span className="text-muted-foreground mr-4">Total Réception:</span>
                                    <span className="text-xl font-bold">{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes / Observations</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Commentaires..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Traitement...
                                    </>
                                ) : (
                                    'Valider la réception'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
