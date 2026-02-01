'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@/features/admin/types';
import { companySchema, CompanySchema } from '../schemas';
import { useCreateCompanyMutation, useUpdateCompanyMutation } from '../api/adminApi';
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
import {
    Building,
    Mail,
    Phone,
    Globe,
    Loader2,
    Briefcase
} from 'lucide-react';

interface CompanyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companyToEdit?: Company | null;
}

export function CompanyDialog({ open, onOpenChange, companyToEdit }: CompanyDialogProps) {
    const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

    const isLoading = isCreating || isUpdating;

    const form = useForm<CompanySchema>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
        },
    });

    useEffect(() => {
        if (companyToEdit) {
            form.reset({
                name: companyToEdit.name,
                email: companyToEdit.email || '',
                phone: companyToEdit.phone || '',
                website: companyToEdit.website || '',
            });
        } else {
            form.reset({
                name: '',
                email: '',
                phone: '',
                website: '',
            });
        }
    }, [companyToEdit, form]);

    async function onSubmit(data: CompanySchema) {
        const toastId = toast.loading(companyToEdit ? 'Mise à jour...' : 'Création...');
        try {
            if (companyToEdit) {
                await updateCompany({ id: companyToEdit.id, ...data }).unwrap();
                toast.success('Entreprise mise à jour', { id: toastId });
            } else {
                await createCompany(data).unwrap();
                toast.success('Entreprise créée', { id: toastId });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { id: toastId, description: error.data?.message || 'Une erreur est survenue' });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,63,94,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-rose-500/20 p-2 rounded-xl backdrop-blur-sm border border-rose-500/30">
                                <Briefcase className="h-5 w-5 text-rose-400" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Identité Corporate
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            {companyToEdit ? 'Modifier Entreprise' : 'Nouvelle Entreprise'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Paramètres légaux et informations de contact de l'entité.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Raison Sociale</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <Input {...field} placeholder="MILELE LTD" className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Officiel</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                    <Input {...field} type="email" placeholder="contact@company.com" className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ligne Directe</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                    <Input {...field} placeholder="+243..." className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Site Web (URL)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <Input {...field} placeholder="https://milele.com" className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-rose-600" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400">
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 rounded-xl px-10 h-11 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20 transition-all active:scale-95" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (companyToEdit ? 'Mettre à jour' : 'Enregistrer')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
