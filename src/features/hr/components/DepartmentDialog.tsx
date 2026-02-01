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
import { Briefcase, Loader2 } from 'lucide-react';

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
            <DialogContent className="max-w-md bg-white border-slate-100 shadow-2xl rounded-3xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-xl">
                            <Briefcase className="h-5 w-5 text-purple-600" />
                        </div>
                        <DialogTitle className="text-xl font-black font-outfit uppercase tracking-tight text-slate-900">
                            {isEditing ? 'Modifier le département' : 'Nouveau département'}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Nom du département</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl" placeholder="ex: Comptabilité" />
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
                                    <FormLabel className="font-bold text-slate-700">Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl h-24" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="border-transparent text-slate-500 hover:bg-slate-100 rounded-xl"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-500/20 rounded-xl"
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
