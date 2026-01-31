'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saasCompanySchema, SaaSCompanySchema } from '../schemas';
import { useCreateCompanyMutation } from '../api/platformApi';
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
import { Loader2, Building2, Mail, Phone, MapPin, ShieldCheck, Landmark, Scale } from 'lucide-react';

interface CompanyManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CompanyManagementDialog({ open, onOpenChange }: CompanyManagementDialogProps) {
    const [createCompany, { isLoading }] = useCreateCompanyMutation();

    const form = useForm<SaaSCompanySchema>({
        resolver: zodResolver(saasCompanySchema),
        defaultValues: {
            companyName: '',
            rccm: '',
            nationalId: '',
            taxId: '',
            headquartersAddress: '',
            phone: '',
            email: '',
            taxRegime: 'Régime Simplifié',
            taxCenter: 'CDI Gombe',
        },
    });

    const onSubmit = async (data: SaaSCompanySchema) => {
        try {
            await createCompany(data).unwrap();
            toast.success('Entreprise enregistrée avec succès. Activez-la pour permettre l\'accès.');
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            toast.error('Échec de l\'enregistrement', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-drc-blue/20 p-2 rounded-xl backdrop-blur-sm border border-drc-blue/30">
                                <Building2 className="h-5 w-5 text-drc-blue" />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-1 w-2 bg-drc-blue rounded-full" />
                                <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                                <div className="h-1 w-2 bg-drc-red rounded-full" />
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            ENREGISTREMENT TENANCIER
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Initialisation d'une nouvelle entité sur la plateforme Milele.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Identité Juridique</h3>
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-bold text-slate-700">Raison Sociale</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Ex: MILELE SERVICES SARL" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold uppercase" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="taxId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">NIF</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-mono font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rccm"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">RCCM</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-mono font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nationalId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">ID National</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-mono font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Fiscalité & Siège</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="taxRegime"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                    <Scale className="h-3 w-3 text-slate-400" /> Régime Fiscal
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="taxCenter"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                    <Landmark className="h-3 w-3 text-slate-400" /> Centre Fiscal
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="headquartersAddress"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-bold text-slate-700">Adresse du Siège</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue" />
                                                    <textarea {...field} rows={2} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 transition-all font-medium text-sm outline-none" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Email Admin</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue" />
                                                        <Input type="email" {...field} className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium" />
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
                                                <FormLabel className="text-xs font-bold text-slate-700">Téléphone Siège</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue" />
                                                        <Input {...field} className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50 border-slate-100">
                                    Fermer
                                </Button>
                                <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all">
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>ENREGISTRER L'ENTREPRISE</span>
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
}
