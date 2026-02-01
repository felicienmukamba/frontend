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
import { Loader2, Target, Calendar } from 'lucide-react';
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
import { useAuth } from '@/features/auth/lib/auth-provider';

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
    const { companyId: currentCompanyId } = useAuth();
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
        const toastId = toast.loading(budgetToEdit ? 'Mise à jour...' : 'Création...');
        try {
            const payload: CreateBudgetDto = {
                ...data,
            };

            if (budgetToEdit) {
                await updateBudget({ id: budgetToEdit.id, ...payload }).unwrap();
                toast.success('Budget mis à jour avec succès', { id: toastId });
            } else {
                await createBudget(payload).unwrap();
                toast.success('Nouveau budget financier créé', { id: toastId });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Échec de l\'opération', { id: toastId, description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-emerald-500/20 p-2 rounded-xl backdrop-blur-sm border border-emerald-500/30">
                                <Target className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Planification Financière
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            {budgetToEdit ? 'Modifier Budget' : 'Nouveau Budget'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Définissez l'enveloppe budgétaire pour un exercice fiscal spécifique.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Libellé du Budget</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ex: BUDGET DE FONCTIONNEMENT 2024" className="h-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:ring-emerald-500/20 uppercase" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fiscalYearId"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Exercice Fiscal
                                        </FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-xs">
                                                    <SelectValue placeholder="Sélectionner un exercice" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100">
                                                {fiscalYears.map((fy: any) => (
                                                    <SelectItem key={fy.id} value={fy.id.toString()} className="font-bold">
                                                        {fy.code} {fy.isClosed && '(Clôturé)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Commentaires (Optionnel)</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Détails supplémentaires sur ce budget..." className="min-h-[100px] rounded-xl border-slate-100 bg-slate-50/50 font-medium resize-none focus:ring-emerald-500/20" />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400">
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95" disabled={isCreating || isUpdating}>
                                    {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (budgetToEdit ? 'Enregistrer les modifications' : 'Initialiser le budget')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
