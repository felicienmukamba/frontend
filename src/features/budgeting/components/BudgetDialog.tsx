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
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
} from '../api/budgetingApi';
import { Budget, CreateBudgetDto } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetFiscalYearsQuery } from '@/features/accounting/api/accountingApi';
import { FiscalYear } from '@/features/accounting/types';
import { extractArray } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const budgetSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    description: z.string().optional(),
    fiscalYearId: z.number().min(1, 'L\'exercice est requis'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    budgetToEdit?: Budget | null;
}

export function BudgetDialog({ open, onOpenChange, budgetToEdit }: BudgetDialogProps) {
    const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
    const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
    const { data: fiscalYearsData } = useGetFiscalYearsQuery();
    const fiscalYears = (Array.isArray(fiscalYearsData) ? fiscalYearsData : fiscalYearsData?.data || []) as FiscalYear[];

    const form = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: '',
            description: '',
            fiscalYearId: 0,
        },
    });

    useEffect(() => {
        if (budgetToEdit) {
            form.reset({
                name: budgetToEdit.name,
                description: budgetToEdit.description || '',
                fiscalYearId: budgetToEdit.fiscalYearId,
            });
        } else {
            const currentFiscalYear = fiscalYears.find((fy) => !fy.isClosed);
            form.reset({
                name: '',
                description: '',
                fiscalYearId: currentFiscalYear?.id || 0,
            });
        }
    }, [budgetToEdit, form, fiscalYears]);

    const onSubmit = async (data: BudgetFormData) => {
        try {
            const payload: CreateBudgetDto = {
                ...data,
            };

            if (budgetToEdit) {
                await updateBudget({ id: budgetToEdit.id, ...payload }).unwrap();
                toast.success('Budget mis à jour');
            } else {
                await createBudget(payload).unwrap();
                toast.success('Budget créé');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{budgetToEdit ? 'Modifier budget' : 'Nouveau budget'}</DialogTitle>
                    <DialogDescription>
                        Créez un budget pour un exercice fiscal
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Budget 2024" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fiscalYearId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exercice fiscal *</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un exercice" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {fiscalYears.map((fy: any) => (
                                                <SelectItem key={fy.id} value={fy.id.toString()}>
                                                    {fy.code} {fy.isClosed && '(Clôturé)'}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Description du budget" />
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
                                {budgetToEdit ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
