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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Employee } from '../types';
import { useCreateEmployeeMutation, useUpdateEmployeeMutation, useGetDepartmentsQuery } from '../api/hrApi';
import { toast } from 'sonner';
import { Loader2, UserCircle2, Briefcase, Mail, Phone, Landmark, CalendarDays, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { extractArray } from '@/lib/utils';

const employeeSchema = z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    phone: z.string().optional(),
    position: z.string().optional(),
    departmentId: z.string().optional(),
    baseSalary: z.coerce.number().min(0, 'Le salaire ne peut pas être négatif'),
    hireDate: z.string().optional(),
    registrationNumber: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED']).default('ACTIVE'),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
}

export const EmployeeDialog = ({ open, onOpenChange, employee }: EmployeeDialogProps) => {
    const { user, companyId } = useAuth();
    const isEditing = !!employee;
    const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
    const { data: departmentsData } = useGetDepartmentsQuery({ companyId: Number(companyId) || 1 });
    const departments = extractArray(departmentsData);

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema) as any,
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            position: '',
            departmentId: '',
            baseSalary: 0,
            hireDate: new Date().toISOString().split('T')[0],
            registrationNumber: '',
            status: 'ACTIVE',
        },
    });

    useEffect(() => {
        if (employee) {
            form.reset({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email || '',
                phone: employee.phone || '',
                position: employee.position || '',
                departmentId: employee.departmentId?.toString() || '',
                baseSalary: employee.baseSalary,
                hireDate: employee.hireDate && !isNaN(new Date(employee.hireDate).getTime())
                    ? new Date(employee.hireDate).toISOString().split('T')[0]
                    : '',
                registrationNumber: employee.registrationNumber || '',
                status: employee.status as any,
            });
        } else {
            form.reset({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                position: '',
                departmentId: '',
                baseSalary: 0,
                hireDate: new Date().toISOString().split('T')[0],
                registrationNumber: '',
                status: 'ACTIVE',
            });
        }
    }, [employee, form, open]);

    const onSubmit = async (values: EmployeeFormValues) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload = {
                ...values,
                companyId: Number(companyId),
            };

            if (isEditing && employee) {
                await updateEmployee({ id: employee.id, data: payload }).unwrap();
                toast.success('Dossier employé mis à jour');
            } else {
                await createEmployee(values).unwrap();
                toast.success('Employé enregistré avec succès');
            }
            onOpenChange(false);
        } catch (error) {
            toast.error('Opération échouée', { description: 'Une erreur technique est survenue lors de l’enregistrement.' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-drc-blue/20 p-2 rounded-xl backdrop-blur-sm border border-drc-blue/30">
                                <UserCircle2 className="h-5 w-5 text-drc-blue" />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-1 w-2 bg-drc-blue rounded-full" />
                                <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                                <div className="h-1 w-2 bg-drc-red rounded-full" />
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            {isEditing ? 'ÉDITION DOSSIER' : 'RECRUTEMENT'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Gestion du capital humain et conformité administrative.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 bg-white max-h-[70vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Section: Identité */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Identité & Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Prénom</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ex: Jean" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Nom</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ex: Mukendi" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold uppercase" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Email Professionnel</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                        <Input type="email" {...field} placeholder="j.mukendi@entreprise.cd" className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Téléphone</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                        <Input {...field} placeholder="+243 ..." className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section: Poste & Contrat */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Poste & Contrat</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Fonction / Titre</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                        <Input {...field} placeholder="Ex: Comptable Senior" className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Département</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold">
                                                            <div className="flex items-center gap-2">
                                                                <Landmark className="h-4 w-4 text-slate-400" />
                                                                <SelectValue placeholder="Choisir un département" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                                        {departments?.map((dept: any) => (
                                                            <SelectItem key={dept.id} value={dept.id.toString()} className="font-bold">
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="baseSalary"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Salaire de Base (USD)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-black text-drc-blue" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="hireDate"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Date d'embauche</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                        <Input type="date" {...field} className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50 border-slate-100 transition-all"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="h-12 px-8 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    {(isCreating || isUpdating) ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>{isEditing ? 'Mettre à jour' : 'Confirmer Recrutement'}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
