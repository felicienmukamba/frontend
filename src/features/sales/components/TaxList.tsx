"use client";

import {
    PremiumTable,
    PremiumTableBody,
    PremiumTableCell,
    PremiumTableHead,
    PremiumTableHeader,
    PremiumTableRow,
    BadgeDRC
} from '@/components/ui/PremiumTable';
import { Button } from '@/components/ui/button';
import { Plus, Percent, MoreHorizontal, Search, Database, ShieldCheck, Scale } from 'lucide-react';
import { useGetTaxesQuery, useCreateTaxMutation } from '../api/salesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
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
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taxSchema, TaxSchema } from '../schemas';
import { Tax } from '../types';
import { extractArray } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const TaxList = () => {
    const { data, isLoading, error } = useGetTaxesQuery();
    const [createTax] = useCreateTaxMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState('');

    const taxes = extractArray<Tax>(data);

    const form = useForm<TaxSchema>({
        resolver: zodResolver(taxSchema) as any,
        defaultValues: {
            code: '',
            rate: 0,
            label: '',
            isDeductible: false,
        },
    });

    const onSubmit = async (data: TaxSchema) => {
        try {
            await createTax({ ...data, companyId: 1 }).unwrap(); // TODO: get companyId from context
            toast.success('Taxe créée');
            setIsDialogOpen(false);
            form.reset();
        } catch (err) {
            toast.error('Erreur lors de la création');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <Skeleton className="h-64 rounded-3xl" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-2xl border border-red-100">Erreur lors du chargement des taxes.</div>;
    }

    const filteredTaxes = taxes.filter(tax =>
        tax.label?.toLowerCase().includes(search.toLowerCase()) ||
        tax.code?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Paramètres Fiscaux
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Taxes & Prélèvements</h2>
                    <p className="text-slate-500 font-medium mt-1">Configurez les taux de taxation applicables à vos opérations.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus className="mr-2 h-5 w-5" /> Nouveau Taux
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par libellé ou code..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Code Fiscal</PremiumTableHead>
                                <PremiumTableHead>Intitulé</PremiumTableHead>
                                <PremiumTableHead>Valeur Nominale</PremiumTableHead>
                                <PremiumTableHead>Régime</PremiumTableHead>
                                <PremiumTableHead className="w-[80px] text-right">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredTaxes.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={5} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Percent className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun taux configuré.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredTaxes.map((tax) => (
                                    <PremiumTableRow key={tax.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-all duration-300">
                                                    <Scale className="h-5 w-5" />
                                                </div>
                                                <div className="font-mono text-xs font-black text-drc-blue uppercase tracking-widest">
                                                    {tax.code}
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-bold text-slate-900 uppercase">{tax.label}</div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 font-black text-slate-900">
                                                {tax.rate}%
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={tax.isDeductible ? "green" : "slate"}>
                                                {tax.isDeductible ? 'TVA RÉCUPÉRABLE' : 'NON DÉDUCTIBLE'}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Option Fiscalité</DropdownMenuLabel>
                                                    <DropdownMenuItem className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER TAUX
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                    >
                                                        ARCHIVER TAXE
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ))
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <DialogHeader className="p-8 bg-slate-900 text-white">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Nouvelle Taxe</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">Configurez une nouvelle taxe pour vos documents commerciaux.</DialogDescription>
                    </DialogHeader>
                    <div className="p-8 pb-10">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control as any}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Code Technique</FormLabel>
                                                <FormControl><Input {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-mono font-bold" placeholder="TVA_16" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="rate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Taux (%)</FormLabel>
                                                <FormControl><Input {...field} type="number" step="0.01" className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-black" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control as any}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Libellé Affiché</FormLabel>
                                            <FormControl><Input {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" placeholder="TVA 16% sur les ventes" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="isDeductible"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-xs font-bold text-slate-900">Taxe déductible</FormLabel>
                                                <div className="text-[10px] text-slate-400 font-medium">Permet la récupération de la TVA</div>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 flex-1 rounded-xl font-bold text-slate-500">ANNULER</Button>
                                    <Button type="submit" className="h-12 flex-2 px-8 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20 transition-all">ENREGISTRER</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
