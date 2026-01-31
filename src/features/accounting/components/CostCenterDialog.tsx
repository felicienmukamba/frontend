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
    useCreateCostCenterMutation,
    useUpdateCostCenterMutation,
} from '../api/accountingApi';
import { CostCenter, CreateCostCenterDto } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';

const costCenterSchema = z.object({
    code: z.string().min(1, 'Le code est requis'),
    designation: z.string().min(1, 'La désignation est requise'),
});

type CostCenterFormData = z.infer<typeof costCenterSchema>;

interface CostCenterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    costCenterToEdit?: CostCenter | null;
}

export function CostCenterDialog({ open, onOpenChange, costCenterToEdit }: CostCenterDialogProps) {
    const { user, companyId } = useAuth();
    const [createCostCenter, { isLoading: isCreating }] = useCreateCostCenterMutation();
    const [updateCostCenter, { isLoading: isUpdating }] = useUpdateCostCenterMutation();

    const form = useForm<CostCenterFormData>({
        resolver: zodResolver(costCenterSchema),
        defaultValues: {
            code: '',
            designation: '',
        },
    });

    useEffect(() => {
        if (costCenterToEdit) {
            form.reset({
                code: costCenterToEdit.code,
                designation: costCenterToEdit.designation,
            });
        } else {
            form.reset({
                code: '',
                designation: '',
            });
        }
    }, [costCenterToEdit, form]);

    const onSubmit = async (data: CostCenterFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateCostCenterDto = {
                ...data,
                companyId: Number(companyId),
            };

            if (costCenterToEdit) {
                await updateCostCenter({ id: costCenterToEdit.id, ...payload }).unwrap();
                toast.success('Centre de coût mis à jour');
            } else {
                await createCostCenter(payload).unwrap();
                toast.success('Centre de coût créé');
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
                    <DialogTitle>{costCenterToEdit ? 'Modifier centre de coût' : 'Nouveau centre de coût'}</DialogTitle>
                    <DialogDescription>
                        Créez un centre de coût pour la comptabilité analytique
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
                                        <Input {...field} placeholder="CC001" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Désignation *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Département Production" />
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
                                {costCenterToEdit ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
