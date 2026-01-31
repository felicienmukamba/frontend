'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DollarSign, Building2, Wallet } from 'lucide-react';

const paymentSchema = z.object({
    method: z.enum(['BANK', 'CASH']),
    paymentDate: z.string().min(1, 'Date de paiement requise'),
    reference: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PayrollPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payslip: {
        id: string;
        employee: {
            firstName: string;
            lastName: string;
        };
        period: {
            name: string;
        };
        netSalary: number;
    } | null;
    onPaymentRecorded?: () => void;
}

export function PayrollPaymentDialog({
    open,
    onOpenChange,
    payslip,
    onPaymentRecorded,
}: PayrollPaymentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            method: 'BANK',
            paymentDate: new Date().toISOString().split('T')[0],
            reference: '',
        },
    });

    const onSubmit = async (data: PaymentFormValues) => {
        if (!payslip) return;

        setIsSubmitting(true);
        const toastId = toast.loading('Enregistrement du paiement...');

        try {
            // TODO: Replace with actual API call
            // await recordSalaryPayment({
            //     payslipId: payslip.id,
            //     method: data.method,
            //     paymentDate: new Date(data.paymentDate),
            //     reference: data.reference,
            // }).unwrap();

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('✅ Paiement enregistré avec succès !', {
                id: toastId,
                description: `📊 Écriture auto-générée (Dr 422 / Cr ${data.method === 'CASH' ? '571' : '521'})`
            });

            onOpenChange(false);
            form.reset();
            onPaymentRecorded?.();
        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error('Échec de l\'enregistrement', {
                id: toastId,
                description: error.data?.message || 'Vérifiez les données'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!payslip) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-drc-blue">
                        <DollarSign className="h-5 w-5" />
                        Enregistrer Paiement Salaire
                    </DialogTitle>
                    <DialogDescription className="text-slate-600">
                        <div className="mt-2 space-y-1">
                            <p className="font-semibold text-slate-900">
                                {payslip.employee.firstName} {payslip.employee.lastName}
                            </p>
                            <p className="text-sm">Période: {payslip.period.name}</p>
                            <p className="text-lg font-bold text-drc-blue">
                                Montant Net: {payslip.netSalary.toLocaleString()} FC
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">
                                        Mode de Paiement
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BANK" className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                    Virement Bancaire
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="CASH" className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="h-4 w-4 text-green-600" />
                                                    Espèces (Caisse)
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">
                                        Date de Paiement
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">
                                        Référence (Optionnel)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Ex: Virement N°..."
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                            <p className="text-sm text-blue-800 font-medium">
                                💡 Écriture comptable OHADA automatique
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Dr 422 (Personnel - Rémunérations dues) / Cr{' '}
                                {form.watch('method') === 'CASH' ? '571 (Caisse)' : '521 (Banque)'}
                            </p>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="rounded-xl"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl bg-drc-blue hover:bg-drc-blue/90"
                            >
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer Paiement'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
