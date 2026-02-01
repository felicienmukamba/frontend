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
import { useCreateTrainingMutation, useGetTrainingDomainsQuery } from '../api/hrApi';
import { useGetActiveFiscalYearQuery } from '@/features/accounting/api/fiscalYearsApi';
import { toast } from 'sonner';
import { Loader2, GraduationCap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const trainingSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().optional(),
    domainId: z.string().min(1, 'Veuillez sélectionner un domaine'),
    startDate: z.string().min(1, 'Date de début requise'),
    endDate: z.string().min(1, 'Date de fin requise'),
    trainer: z.string().optional(),
    location: z.string().optional(),
});

type TrainingFormValues = z.infer<typeof trainingSchema>;

interface TrainingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const TrainingDialog = ({ open, onOpenChange }: TrainingDialogProps) => {
    const [createTraining, { isLoading: isCreating }] = useCreateTrainingMutation();
    const { data: domains } = useGetTrainingDomainsQuery();
    const { data: activeFiscalYear, isLoading: fiscalYearLoading } = useGetActiveFiscalYearQuery();

    const form = useForm<TrainingFormValues>({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            title: '',
            description: '',
            domainId: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            trainer: '',
            location: '',
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

    const onSubmit = async (values: TrainingFormValues) => {
        try {
            await createTraining(values).unwrap();
            toast.success('Session de formation créée');
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
                        <div className="bg-purple-100 p-2 rounded-xl">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                        </div>
                        <DialogTitle className="text-xl font-black font-outfit uppercase tracking-tight text-slate-900">
                            Programmer une Formation
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Titre de la formation</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="domainId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Domaine</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl">
                                                <SelectValue placeholder="Choisir un domaine" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white border-slate-100 shadow-xl">
                                            {domains?.map((domain) => (
                                                <SelectItem key={domain.id} value={domain.id}>
                                                    {domain.name}
                                                </SelectItem>
                                            ))}
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
                                        <FormLabel className="font-bold text-slate-700">Début</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl" />
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
                                        <FormLabel className="font-bold text-slate-700">Fin</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="trainer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Formateur</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Lieu</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl" />
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
                                disabled={isCreating}
                            >
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
