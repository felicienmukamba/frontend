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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateLeaveMutation, useGetEmployeesQuery } from '../api/hrApi';
import { useGetActiveFiscalYearQuery } from '@/features/accounting/api/fiscalYearsApi';
import { toast } from 'sonner';
import { Loader2, Calendar, AlertCircle, Plane } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { extractArray } from '@/lib/utils';

const leaveSchema = z.object({
    employeeId: z.string().min(1, 'Veuillez sélectionner un employé'),
    type: z.string().min(1, 'Veuillez sélectionner un type'),
    startDate: z.string().min(1, 'Date de début requise'),
    endDate: z.string().min(1, 'Date de fin requise'),
    reason: z.string().min(3, 'Raison trop courte'),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface LeaveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LeaveDialog = ({ open, onOpenChange }: LeaveDialogProps) => {
    const [createLeave, { isLoading: isCreating }] = useCreateLeaveMutation();
    const { data: employeesData } = useGetEmployeesQuery({});
    const { data: activeFiscalYear, isLoading: fiscalYearLoading } = useGetActiveFiscalYearQuery();
    const employees = extractArray(employeesData);

    const form = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            employeeId: '',
            type: 'ANNUAL',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            reason: '',
        },
    });

    // Sync dates with Active Fiscal Year
    useEffect(() => {
        if (activeFiscalYear && open) {
            const startStr = new Date(activeFiscalYear.startDate).toISOString().split('T')[0];
            const endStr = new Date(activeFiscalYear.endDate).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            // If today is within FY, use today, otherwise FY start
            if (today >= startStr && today <= endStr) {
                form.setValue('startDate', today);
                form.setValue('endDate', today);
            } else {
                form.setValue('startDate', startStr);
                form.setValue('endDate', startStr);
            }
        }
    }, [activeFiscalYear, open, form]);

    const onSubmit = async (values: LeaveFormValues) => {
        try {
            await createLeave(values).unwrap();
            toast.success('Demande de congé enregistrée');
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast.error('Erreur lors de l’enregistrement');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white border-slate-100 shadow-2xl rounded-3xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-emerald-100 p-2 rounded-xl">
                            <Plane className="h-5 w-5 text-emerald-600" />
                        </div>
                        <DialogTitle className="text-xl font-black font-outfit uppercase tracking-tight text-slate-900">
                            Nouvelle Demande de Congé
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {!activeFiscalYear && !fiscalYearLoading && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Attention</AlertTitle>
                        <AlertDescription>
                            Aucun exercice fiscal actif.
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Employé</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl">
                                                <SelectValue placeholder="Choisir un employé" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border-slate-100 shadow-xl">
                                            {employees?.map((emp: any) => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.firstName} {emp.lastName}
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Type de congé</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl">
                                                <SelectValue placeholder="Type de congé" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border-slate-100 shadow-xl">
                                            <SelectItem value="ANNUAL">Annuel</SelectItem>
                                            <SelectItem value="SICK">Maladie</SelectItem>
                                            <SelectItem value="MATERNITY">Maternité</SelectItem>
                                            <SelectItem value="EXAM">Examen</SelectItem>
                                            <SelectItem value="OTHER">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        <FormLabel className="font-bold text-slate-700">Date de début</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl" />
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
                                        <FormLabel className="font-bold text-slate-700">Date de fin</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Motif</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl" placeholder="Raison de la demande" />
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
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/20 rounded-xl"
                                disabled={isCreating}
                            >
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Soumettre
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
