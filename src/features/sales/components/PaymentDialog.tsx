'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePaymentMutation } from '../api/salesApi';
import { paymentSchema, PaymentSchema } from '../schemas';
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
import { toast } from 'sonner';
import { Loader2, DollarSign, Banknote, Calendar, CreditCard, ChevronRight, Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: Invoice;
}

export function PaymentDialog({ open, onOpenChange, invoice }: PaymentDialogProps) {
    const { user, companyId } = useAuth();
    const [createPayment, { isLoading }] = useCreatePaymentMutation();

    const form = useForm<PaymentSchema>({
        resolver: zodResolver(paymentSchema) as any,
        defaultValues: {
            invoiceId: invoice.id.toString(),
            amount: Number(invoice.totalAmountInclTax),
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'CASH',
            reference: '',
        },
    });

    const onSubmit = async (data: PaymentSchema) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            await createPayment({
                ...data,
                date: data.paymentDate,
                companyId: Number(companyId)
            } as any).unwrap();
            toast.success('Paiement enregistré et validé comptablement');
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            toast.error('Échec de l’enregistrement', { description: error.data?.message || 'Vérifiez les soldes ou la connexion.' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-emerald-500/20 p-2 rounded-xl backdrop-blur-sm border border-emerald-500/30">
                                <Wallet className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="h-1 w-8 bg-drc-blue rounded-full" />
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            ENCAISSEMENT
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Règlement de la facture <span className="text-emerald-400 font-mono font-bold">#{invoice.invoiceNumber}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 bg-white">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-5">
                            <FormField
                                control={form.control as any}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Banknote className="h-3 w-3" /> Montant reçu ({invoice.currency})
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" step="0.01" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-black text-lg text-emerald-600" />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="paymentDate"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Calendar className="h-3 w-3" /> Date
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <CreditCard className="h-3 w-3" /> Mode
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100">
                                                    <SelectItem value="CASH" className="text-xs font-bold">ESPÈCES (CASH)</SelectItem>
                                                    <SelectItem value="BANK_TRANSFER" className="text-xs font-bold">VIREMENT</SelectItem>
                                                    <SelectItem value="CHEQUE" className="text-xs font-bold">CHÈQUE</SelectItem>
                                                    <SelectItem value="MOBILE_MONEY" className="text-xs font-bold">MOBILE MONEY</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control as any}
                                name="reference"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Référence / Bordereau</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ex: BDR-2024-001" className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-xs" />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            <span>VALIDER LE RÈGLEMENT</span>
                                            <ChevronRight className="h-4 w-4 opacity-50" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="w-full mt-2 h-10 rounded-xl text-slate-400 font-bold text-[10px] tracking-widest uppercase"
                                >
                                    Annuler l'opération
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
