'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { Department } from '../types';
import { useCreateDepartmentMutation, useUpdateDepartmentMutation } from '../api/hrApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const departmentSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    description: z.string().optional(),
    companyId: z.coerce.number().default(1),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    department?: Department | null;
}

export const DepartmentDialog = ({ open, onOpenChange, department }: DepartmentDialogProps) => {
    const isEditing = !!department;
    const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
    const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
    const isLoading = isCreating || isUpdating;

    const form = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema) as any,
        defaultValues: {
            name: '',
            description: '',
            companyId: 1,
        },
    });

    useEffect(() => {
        if (department) {
            form.reset({
                name: department.name,
                description: department.description || '',
                companyId: department.companyId,
            });
        } else {
            form.reset({
                name: '',
                description: '',
                companyId: 1,
            });
        }
    }, [department, form, open]);

    const onSubmit = async (values: DepartmentFormValues) => {
        try {
            if (isEditing && department) {
                await updateDepartment({ id: department.id, data: values }).unwrap();
                toast.success('Département mis à jour');
            } else {
                await createDepartment(values).unwrap();
                toast.success('Département créé avec succès');
            }
            onOpenChange(false);
        } catch (error) {
            toast.error('Erreur lors de l’enregistrement');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEditing ? 'Modifier le département' : 'Nouveau département'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du département</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-slate-800 border-slate-700" placeholder="ex: Comptabilité" />
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
                                        <Textarea {...field} className="bg-slate-800 border-slate-700 h-24" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? 'Enregistrer' : 'Créer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
