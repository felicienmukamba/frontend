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
    useCreateFiscalYearMutation,
    useUpdateFiscalYearMutation,
} from '../api/accountingApi';
import { FiscalYear, CreateFiscalYearDto } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';

const fiscalYearSchema = z.object({
    code: z.string().min(1, 'Le code est requis'),
    startDate: z.string().min(1, 'La date de début est requise'),
    endDate: z.string().min(1, 'La date de fin est requise'),
}).refine((data) => {
    return new Date(data.startDate) < new Date(data.endDate);
}, {
    message: 'La date de fin doit être postérieure à la date de début',
    path: ['endDate'],
});

type FiscalYearFormData = z.infer<typeof fiscalYearSchema>;

interface FiscalYearDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fiscalYearToEdit?: FiscalYear | null;
}

export function FiscalYearDialog({ open, onOpenChange, fiscalYearToEdit }: FiscalYearDialogProps) {
    const { user, companyId } = useAuth();
    const [createFiscalYear, { isLoading: isCreating }] = useCreateFiscalYearMutation();
    const [updateFiscalYear, { isLoading: isUpdating }] = useUpdateFiscalYearMutation();

    const form = useForm<FiscalYearFormData>({
        resolver: zodResolver(fiscalYearSchema),
        defaultValues: {
            code: '',
            startDate: '',
            endDate: '',
        },
    });

    useEffect(() => {
        if (fiscalYearToEdit) {
            form.reset({
                code: fiscalYearToEdit.code,
                startDate: fiscalYearToEdit.startDate.split('T')[0],
                endDate: fiscalYearToEdit.endDate.split('T')[0],
            });
        } else {
            const currentYear = new Date().getFullYear();
            form.reset({
                code: currentYear.toString(),
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            });
        }
    }, [fiscalYearToEdit, form]);

    const onSubmit = async (data: FiscalYearFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateFiscalYearDto = {
                ...data,
                companyId: Number(companyId),
            };

            if (fiscalYearToEdit) {
                await updateFiscalYear({ id: fiscalYearToEdit.id, ...payload }).unwrap();
                toast.success('Exercice mis à jour');
            } else {
                await createFiscalYear(payload).unwrap();
                toast.success('Exercice créé');
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
                    <DialogTitle>{fiscalYearToEdit ? 'Modifier exercice' : 'Nouvel exercice fiscal'}</DialogTitle>
                    <DialogDescription>
                        Créez un nouvel exercice comptable (année fiscale)
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="2024" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date début *</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date fin *</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {fiscalYearToEdit ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
