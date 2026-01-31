'use client';

import React from 'react';
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
import { useCreateAttendanceMutation, useGetEmployeesQuery } from '../api/hrApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { extractArray } from '@/lib/utils';
const attendanceSchema = z.object({
    employeeId: z.string().min(1, 'Veuillez sélectionner un employé'),
    date: z.string().min(1, 'Date requise'),
    arrivalTime: z.string().min(1, 'Heure d’arrivée requise'),
    departureTime: z.string().min(1, 'Heure de départ requise'),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

interface AttendanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AttendanceDialog = ({ open, onOpenChange }: AttendanceDialogProps) => {
    const [createAttendance, { isLoading: isCreating }] = useCreateAttendanceMutation();
    const { data: employeesData } = useGetEmployeesQuery({});
    const employees = extractArray(employeesData);

    const form = useForm<AttendanceFormValues>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            employeeId: '',
            date: new Date().toISOString().split('T')[0],
            arrivalTime: '',
            departureTime: '',
        },
    });

    const onSubmit = async (values: AttendanceFormValues) => {
        try {
            // Convert time strings to ISO format for the backend
            const arrival = `${values.date}T${values.arrivalTime}:00.000Z`;
            const departure = `${values.date}T${values.departureTime}:00.000Z`;

            await createAttendance({
                employeeId: values.employeeId,
                date: values.date,
                arrivalTime: arrival,
                departureTime: departure,
            }).unwrap();

            toast.success('Pointage enregistré');
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast.error('Erreur lors de l’enregistrement');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Pointer une présence</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employé</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-slate-800 border-slate-700">
                                                <SelectValue placeholder="Choisir un employé" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
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
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="bg-slate-800 border-slate-700" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="arrivalTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heure d'arrivée</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="bg-slate-800 border-slate-700" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="departureTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heure de départ</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="bg-slate-800 border-slate-700" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
