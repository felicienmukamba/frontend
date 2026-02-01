'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, BranchSchema } from '../schemas';
import { useCreateBranchMutation, useUpdateBranchMutation } from '../api/adminApi';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
    Plus,
    Building2,
    MapPin,
    Phone,
    Mail,
    Hash,
    Loader2,
    ChevronRight,
    Search
} from 'lucide-react';
import { Branch } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';

interface BranchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branchToEdit?: Branch | null;
}

export function BranchDialog({ open, onOpenChange, branchToEdit }: BranchDialogProps) {
    const { user, companyId } = useAuth();
    const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
    const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
    const isLoading = isCreating || isUpdating;

    const form = useForm<BranchSchema>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            name: '',
            code: '',
            address: '',
            phone: '',
            email: '',
            companyId: Number(companyId) || 1,
        },
    });

    useEffect(() => {
        if (branchToEdit) {
            form.reset({
                name: branchToEdit.name,
                code: branchToEdit.code || '',
                address: branchToEdit.address || '',
                phone: branchToEdit.phone || '',
                email: branchToEdit.email || '',
                companyId: branchToEdit.companyId,
            });
        } else {
            form.reset({
                name: '',
                code: '',
                address: '',
                phone: '',
                email: '',
                companyId: Number(companyId) || 1,
            });
        }
    }, [branchToEdit, form, user, companyId]);

    const onSubmit: SubmitHandler<BranchSchema> = async (data) => {
        const toastId = toast.loading(branchToEdit ? 'Mise à jour...' : 'Création...');
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    id: toastId,
                    description: "Impossible de récupérer l'ID société."
                });
                return;
            }

            if (branchToEdit) {
                await updateBranch({ id: branchToEdit.id, ...data }).unwrap();
                toast.success('Succursale mise à jour', { id: toastId });
            } else {
                await createBranch(data).unwrap();
                toast.success('Succursale créée', { id: toastId });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { id: toastId, description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-500/20 p-2 rounded-xl backdrop-blur-sm border border-blue-500/30">
                                <Building2 className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Multi-Sites & Logistique
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            {branchToEdit ? 'Modifier Succursale' : 'Nouvelle Succursale'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Paramétrage des points de vente et bureaux régionaux.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                Désignation du Site
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} placeholder="Kinshasa Gombe" className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                Code Analytique
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} placeholder="KNG" className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-mono font-bold text-blue-600 uppercase" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control as any}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Adresse Physique</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                <Input {...field} placeholder="N° 12, Av. de la Justice..." className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Téléphonique</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} placeholder="+243..." className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Direction</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} type="email" placeholder="branch@company.com" className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400">
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (branchToEdit ? 'Mettre à jour le site' : 'Enregistrer la succursale')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
