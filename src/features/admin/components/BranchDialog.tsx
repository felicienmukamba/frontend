'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, BranchSchema } from '../schemas';
import { useCreateBranchMutation, useUpdateBranchMutation } from '../api/adminApi';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Branch } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';

interface BranchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branchToEdit?: Branch | null;
}

export function BranchDialog({ open, onOpenChange, branchToEdit }: BranchDialogProps) {
    const { user, companyId } = useAuth();
    const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
    const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
    const isLoading = isCreating || isUpdating;

    const form = useForm<BranchSchema>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            name: '',
            code: '',
            address: '',
            phone: '',
            email: '',
            companyId: Number(companyId) || 1,
        },
    });

    useEffect(() => {
        if (branchToEdit) {
            form.reset({
                name: branchToEdit.name,
                code: branchToEdit.code || '',
                address: branchToEdit.address || '',
                phone: branchToEdit.phone || '',
                email: branchToEdit.email || '',
                companyId: branchToEdit.companyId,
            });
        } else {
            form.reset({
                name: '',
                code: '',
                address: '',
                phone: '',
                email: '',
                companyId: Number(companyId) || 1,
            });
        }
    }, [branchToEdit, form, user]);

    const onSubmit: SubmitHandler<BranchSchema> = async (data) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            if (branchToEdit) {
                await updateBranch({ id: branchToEdit.id, ...data }).unwrap();
                toast.success('Succursale mise à jour');
            } else {
                await createBranch(data).unwrap();
                toast.success('Succursale créée');
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
                    <DialogTitle>{branchToEdit ? 'Modifier succursale' : 'Ajouter une succursale'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl><Input {...field} placeholder="Kinshasa Gombe" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl><Input {...field} placeholder="KNG" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control as any}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input {...field} type="email" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {branchToEdit ? 'Enregistrer' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
