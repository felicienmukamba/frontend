'use client';

import React, { useState } from 'react';
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
import { Loader2, Plus, Trash2, Target, Calculator } from 'lucide-react';
import {
    useAddBudgetLineMutation,
    useUpdateBudgetLineMutation,
    useDeleteBudgetLineMutation,
} from '../api/budgetingApi';
import { useGetAccountsQuery } from '@/features/accounting/api/accountingApi';
import { Budget, BudgetLine } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PremiumTable, PremiumTableBody, PremiumTableCell, PremiumTableHead, PremiumTableHeader, PremiumTableRow } from '@/components/ui/PremiumTable';
import { formatCurrency } from '@/lib/utils';

const lineSchema = z.object({
    accountId: z.number().min(1, 'Le compte est requis'),
    forecastAmount: z.number().min(0, 'Le montant doit être positif'),
});

type LineFormData = z.infer<typeof lineSchema>;

interface BudgetLinesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    budget: Budget | null;
}

export function BudgetLinesDialog({ open, onOpenChange, budget }: BudgetLinesDialogProps) {
    const { data: accountsData } = useGetAccountsQuery();
    const accounts = Array.isArray(accountsData) ? accountsData : accountsData?.data || [];

    const [addLine, { isLoading: isAdding }] = useAddBudgetLineMutation();
    const [updateLine] = useUpdateBudgetLineMutation();
    const [deleteLine] = useDeleteBudgetLineMutation();

    const form = useForm<LineFormData>({
        resolver: zodResolver(lineSchema),
        defaultValues: {
            accountId: 0,
            forecastAmount: 0,
        },
    });

    const onSubmit = async (data: LineFormData) => {
        if (!budget) return;

        try {
            await addLine({
                budgetId: budget.id,
                ...data,
            }).unwrap();
            toast.success('Ligne budgétaire ajoutée');
            form.reset({ accountId: 0, forecastAmount: 0 });
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Impossible d\'ajouter la ligne' });
        }
    };

    const handleDelete = async (lineId: string) => {
        try {
            await deleteLine(lineId).unwrap();
            toast.success('Ligne supprimée');
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Impossible de supprimer la ligne' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-500/20 p-2 rounded-xl backdrop-blur-sm border border-blue-500/30">
                                <Calculator className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Configuration des Lignes
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            Lignes du Budget: {budget?.name}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Affectez des montants prévisionnels aux comptes comptables pour cet exercice.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-6 max-h-[70vh] overflow-y-auto">
                    {/* Add New Line Form */}
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Ajouter une prévision</h4>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <FormField
                                    control={form.control}
                                    name="accountId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Compte Comptable</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase">
                                                        <SelectValue placeholder="Choisir un compte" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100">
                                                    {accounts.map((acc: any) => (
                                                        <SelectItem key={acc.id} value={acc.id.toString()} className="font-bold uppercase text-[10px]">
                                                            {acc.accountNumber} - {acc.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="forecastAmount"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Montant Prévu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                    className="h-10 rounded-xl border-slate-200 bg-white font-black text-xs uppercase"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200" disabled={isAdding}>
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> AJOUTER LA LIGNE</>}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Lines Table */}
                    <div className="rounded-2xl border border-slate-100 overflow-hidden">
                        <PremiumTable>
                            <PremiumTableHeader>
                                <PremiumTableRow className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <PremiumTableHead>Compte</PremiumTableHead>
                                    <PremiumTableHead className="text-right">Prévisionnel</PremiumTableHead>
                                    <PremiumTableHead className="w-[50px]"></PremiumTableHead>
                                </PremiumTableRow>
                            </PremiumTableHeader>
                            <PremiumTableBody>
                                {budget?.lines?.length === 0 ? (
                                    <PremiumTableRow>
                                        <PremiumTableCell colSpan={3} className="text-center py-12 text-slate-400 font-medium italic">
                                            Aucune ligne budgétaire définie.
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ) : (
                                    budget?.lines?.map((line) => (
                                        <PremiumTableRow key={line.id} className="group hover:bg-slate-50/50 transition-colors text-xs font-bold">
                                            <PremiumTableCell>
                                                <div className="uppercase tracking-tight">
                                                    <span className="text-slate-400 mr-2">{line.account?.accountNumber}</span>
                                                    <span className="text-slate-900">{line.account?.label}</span>
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right text-emerald-600 font-black">
                                                {formatCurrency(line.forecastAmount, 'USD')}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(line.id)}
                                                    className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    ))
                                )}
                            </PremiumTableBody>
                        </PremiumTable>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500 border-slate-200">
                            Fermer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
