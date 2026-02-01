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
import { useCreatePayrollPeriodMutation } from '../api/hrApi';
import { useGetActiveFiscalYearQuery } from '@/features/accounting/api/fiscalYearsApi';
import { toast } from 'sonner';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const payrollPeriodSchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    name: z.string().optional(),
});

type PayrollPeriodFormValues = z.infer<typeof payrollPeriodSchema>;

interface PayrollPeriodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const MONTHS = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
];

export const PayrollPeriodDialog = ({ open, onOpenChange, onSuccess }: PayrollPeriodDialogProps) => {
    const [createPeriod, { isLoading }] = useCreatePayrollPeriodMutation();
    const { data: activeFiscalYear, isLoading: fiscalYearLoading } = useGetActiveFiscalYearQuery();

    const form = useForm<PayrollPeriodFormValues>({
        resolver: zodResolver(payrollPeriodSchema) as any,
        defaultValues: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            name: '',
        },
    });

    // Set year based on active fiscal year
    useEffect(() => {
        if (activeFiscalYear && open) {
            const fyStart = new Date(activeFiscalYear.startDate);
            const fyEnd = new Date(activeFiscalYear.endDate);
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            // Default to current year if inside FY, else FY start year
            if (currentYear >= fyStart.getFullYear() && currentYear <= fyEnd.getFullYear()) {
                form.setValue('year', currentYear);
            } else {
                form.setValue('year', fyStart.getFullYear());
            }
        }
    }, [activeFiscalYear, open, form]);

    const onSubmit = async (values: PayrollPeriodFormValues) => {
        try {
            await createPeriod(values).unwrap();
            toast.success('Période de paie ouverte avec succès');
            onSuccess?.();
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors de l\'ouverture de la période');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white border-slate-100 shadow-2xl rounded-3xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-xl">
                            <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <DialogTitle className="text-xl font-black font-outfit uppercase tracking-tight text-slate-900">
                            Nouvelle Période
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {!activeFiscalYear && !fiscalYearLoading && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Attention</AlertTitle>
                        <AlertDescription>
                            Aucun exercice fiscal actif. Veuillez en activer un d'abord.
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-slate-700">Mois</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium focus:ring-purple-500">
                                                    <SelectValue placeholder="Choisir le mois" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[300px]">
                                                {MONTHS.map((m) => (
                                                    <SelectItem key={m.value} value={m.value.toString()}>
                                                        {m.label}
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
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-slate-700">Année</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium focus:visible:ring-purple-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Libellé (Optionnel)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ex: Paie Janvier 2026"
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50 font-medium focus-visible:ring-purple-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {activeFiscalYear && (
                            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                Exercice actif : <strong>{activeFiscalYear.code}</strong> ({new Date(activeFiscalYear.startDate).getFullYear()} - {new Date(activeFiscalYear.endDate).getFullYear()})
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !activeFiscalYear}
                                className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ouvrir Période
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
