'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@/features/admin/types';
import { companySchema, CompanySchema } from '../schemas';
import { useCreateCompanyMutation, useUpdateCompanyMutation } from '../api/adminApi';
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

interface CompanyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyToEdit?: Company | null;
}

export function CompanyDialog({ open, onOpenChange, companyToEdit }: CompanyDialogProps) {
    const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

    const isLoading = isCreating || isUpdating;

    const form = useForm<CompanySchema>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
        },
    });

    useEffect(() => {
        if (companyToEdit) {
            form.reset({
                name: companyToEdit.name,
                email: companyToEdit.email || '',
                phone: companyToEdit.phone || '',
                website: companyToEdit.website || '',
            });
        } else {
            form.reset({
                name: '',
                email: '',
                phone: '',
                website: '',
            });
        }
    }, [companyToEdit, form]);

    async function onSubmit(data: CompanySchema) {
        try {
            if (companyToEdit) {
                await updateCompany({ id: companyToEdit.id, ...data }).unwrap();
                toast.success('Entreprise mise à jour');
            } else {
                await createCompany(data).unwrap();
                toast.success('Entreprise créée');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue' });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{companyToEdit ? 'Modifier entreprise' : 'Ajouter entreprise'}</DialogTitle>
                    <DialogDescription>
                        {companyToEdit ? 'Modifiez les informations ci-dessous.' : 'Renseignez les détails de la nouvelle entreprise.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site Web</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {companyToEdit ? 'Enregistrer' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
