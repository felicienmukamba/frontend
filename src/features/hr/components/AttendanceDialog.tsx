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
import { Loader2, Clock } from 'lucide-react';

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
            <DialogContent className="max-w-md bg-white border-slate-100 shadow-2xl rounded-3xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <DialogTitle className="text-xl font-black font-outfit uppercase tracking-tight text-slate-900">
                            Pointer une présence
                        </DialogTitle>
                    </div>
                </DialogHeader>
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
                                            <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl">
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
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-slate-700">Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl" />
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
                                        <FormLabel className="font-bold text-slate-700">Heure d'arrivée</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl" />
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
                                        <FormLabel className="font-bold text-slate-700">Heure de départ</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} className="bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/20 rounded-xl"
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
