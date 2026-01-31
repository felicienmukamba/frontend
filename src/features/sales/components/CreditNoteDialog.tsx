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
    useCreateCreditNoteMutation,
    useUpdateCreditNoteMutation,
} from '../api/salesApi';
import { CreditNote, CreateCreditNoteDto } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetThirdPartiesQuery } from '@/features/resources/api/resourcesApi';
import { extractArray } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const creditNoteSchema = z.object({
    creditNoteNumber: z.string().min(1),
    issuedAt: z.string().min(1),
    type: z.enum(['REFUND', 'CANCELLATION']),
    currency: z.string().default('FC'),
    exchangeRate: z.number().default(1),
    totalAmountExclTax: z.number().min(0),
    totalVAT: z.number().min(0),
    totalAmountInclTax: z.number().min(0),
    status: z.enum(['DRAFT', 'VALIDATED', 'CANCELED']).default('DRAFT'),
    observation: z.string().optional(),
    invoiceId: z.number().optional(),
    clientId: z.number().min(1),
});

type CreditNoteFormData = z.infer<typeof creditNoteSchema>;

interface CreditNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    creditNoteToEdit?: CreditNote | null;
}

export function CreditNoteDialog({ open, onOpenChange, creditNoteToEdit }: CreditNoteDialogProps) {
    const { user, companyId } = useAuth();
    const [createCreditNote, { isLoading: isCreating }] = useCreateCreditNoteMutation();
    const [updateCreditNote, { isLoading: isUpdating }] = useUpdateCreditNoteMutation();
    const { data: thirdPartiesData } = useGetThirdPartiesQuery({ type: 'CUSTOMER' });
    const thirdParties = extractArray(thirdPartiesData);

    const form = useForm<CreditNoteFormData>({
        resolver: zodResolver(creditNoteSchema) as any,
        defaultValues: {
            creditNoteNumber: '',
            issuedAt: new Date().toISOString().split('T')[0],
            type: 'REFUND',
            currency: 'FC',
            exchangeRate: 1,
            totalAmountExclTax: 0,
            totalVAT: 0,
            totalAmountInclTax: 0,
            status: 'DRAFT',
            clientId: 0,
        },
    });

    useEffect(() => {
        if (creditNoteToEdit) {
            form.reset({
                creditNoteNumber: creditNoteToEdit.creditNoteNumber,
                issuedAt: creditNoteToEdit.issuedAt.split('T')[0],
                type: creditNoteToEdit.type,
                currency: creditNoteToEdit.currency,
                exchangeRate: creditNoteToEdit.exchangeRate,
                totalAmountExclTax: creditNoteToEdit.totalAmountExclTax,
                totalVAT: creditNoteToEdit.totalVAT,
                totalAmountInclTax: creditNoteToEdit.totalAmountInclTax,
                status: creditNoteToEdit.status,
                observation: creditNoteToEdit.observation,
                invoiceId: creditNoteToEdit.invoiceId,
                clientId: creditNoteToEdit.clientId,
            });
        } else {
            form.reset({
                creditNoteNumber: '',
                issuedAt: new Date().toISOString().split('T')[0],
                type: 'REFUND',
                currency: 'FC',
                exchangeRate: 1,
                totalAmountExclTax: 0,
                totalVAT: 0,
                totalAmountInclTax: 0,
                status: 'DRAFT',
                clientId: 0,
            });
        }
    }, [creditNoteToEdit, form]);

    const onSubmit = async (data: CreditNoteFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateCreditNoteDto = {
                ...data,
                companyId: Number(companyId),
                createdById: user?.id || 1,
            };

            if (creditNoteToEdit) {
                await updateCreditNote({ id: creditNoteToEdit.id, ...payload }).unwrap();
                toast.success('Note de crédit mise à jour');
            } else {
                await createCreditNote(payload).unwrap();
                toast.success('Note de crédit créée');
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
                    <DialogTitle>{creditNoteToEdit ? 'Modifier note de crédit' : 'Nouvelle note de crédit'}</DialogTitle>
                    <DialogDescription>
                        Créez une note de crédit (avoir) pour un client
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="creditNoteNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numéro *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="AV-2024-001" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issuedAt"
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
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client *</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un client" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {thirdParties.map((tp: any) => (
                                                <SelectItem key={tp.id} value={tp.id.toString()}>
                                                    {tp.name}
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
                                            <SelectItem value="REFUND">Remboursement</SelectItem>
                                            <SelectItem value="CANCELLATION">Annulation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="totalAmountExclTax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Montant HT *</FormLabel>
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
                                name="totalVAT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>TVA *</FormLabel>
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
                                name="totalAmountInclTax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Montant TTC *</FormLabel>
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
                            name="observation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observation</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Remarques..." />
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
                                {creditNoteToEdit ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
