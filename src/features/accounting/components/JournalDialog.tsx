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
    useCreateJournalMutation,
    useUpdateJournalMutation,
} from '../api/accountingApi';
import { Journal, CreateJournalDto } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { Textarea } from '@/components/ui/textarea';

const journalSchema = z.object({
    code: z.string().min(1, 'Le code est requis'),
    label: z.string().min(1, 'Le libellé est requis'),
    description: z.string().optional(),
});

type JournalFormData = z.infer<typeof journalSchema>;

interface JournalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    journalToEdit?: Journal | null;
}

export function JournalDialog({ open, onOpenChange, journalToEdit }: JournalDialogProps) {
    const { user, companyId } = useAuth();
    const [createJournal, { isLoading: isCreating }] = useCreateJournalMutation();
    const [updateJournal, { isLoading: isUpdating }] = useUpdateJournalMutation();

    const form = useForm<JournalFormData>({
        resolver: zodResolver(journalSchema),
        defaultValues: {
            code: '',
            label: '',
            description: '',
        },
    });

    useEffect(() => {
        if (journalToEdit) {
            form.reset({
                code: journalToEdit.code,
                label: journalToEdit.label,
                description: journalToEdit.description || '',
            });
        } else {
            form.reset({
                code: '',
                label: '',
                description: '',
            });
        }
    }, [journalToEdit, form]);

    const onSubmit = async (data: JournalFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateJournalDto = {
                ...data,
                companyId: Number(companyId),
            };

            if (journalToEdit) {
                await updateJournal({ id: journalToEdit.id, ...payload }).unwrap();
                toast.success('Journal mis à jour');
            } else {
                await createJournal(payload).unwrap();
                toast.success('Journal créé');
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
                    <DialogTitle>{journalToEdit ? 'Modifier journal' : 'Nouveau journal'}</DialogTitle>
                    <DialogDescription>
                        Créez un journal comptable (VT, HA, BQ, CA, OD, etc.)
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
                                        <Input {...field} placeholder="VT" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Libellé *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Journal des Ventes" />
                                    </FormControl>
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
                                        <Textarea {...field} placeholder="Description du journal" />
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
                                {journalToEdit ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
