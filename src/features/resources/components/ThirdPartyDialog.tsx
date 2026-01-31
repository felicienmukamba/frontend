'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThirdParty, ThirdPartyType } from '../types';
import { thirdPartySchema, ThirdPartySchema } from '../schemas';
import { useCreateThirdPartyMutation, useUpdateThirdPartyMutation } from '../api/resourcesApi';
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
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Users2, Landmark, Mail, Phone, MapPin, ShieldCheck, Wallet, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

interface ThirdPartyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    thirdPartyToEdit?: ThirdParty | null;
    initialType?: ThirdPartyType;
}

export function ThirdPartyDialog({ open, onOpenChange, thirdPartyToEdit, initialType }: ThirdPartyDialogProps) {
    const [createThirdParty, { isLoading: isCreating }] = useCreateThirdPartyMutation();
    const [updateThirdParty, { isLoading: isUpdating }] = useUpdateThirdPartyMutation();

    const isLoading = isCreating || isUpdating;

    const form = useForm<ThirdPartySchema>({
        resolver: zodResolver(thirdPartySchema) as any,
        defaultValues: {
            type: ThirdPartyType.CUSTOMER,
            name: '',
            taxId: '',
            rccm: '',
            address: '',
            phone: '',
            email: '',
            isVatSubject: false,
            creditLimit: 0,
        },
    });

    useEffect(() => {
        if (thirdPartyToEdit) {
            form.reset({
                ...thirdPartyToEdit,
                email: thirdPartyToEdit.email || '',
                phone: thirdPartyToEdit.phone || '',
                address: thirdPartyToEdit.address || '',
                creditLimit: thirdPartyToEdit.creditLimit ? parseFloat(thirdPartyToEdit.creditLimit.toString()) : 0,
            });
        } else {
            form.reset({
                type: initialType || ThirdPartyType.CUSTOMER,
                name: '',
                email: '',
                phone: '',
                address: '',
                taxId: '',
                rccm: '',
                isVatSubject: false,
                creditLimit: 0,
            });
        }
    }, [thirdPartyToEdit, initialType, form, open]);

    const onSubmit: SubmitHandler<ThirdPartySchema> = async (data) => {
        try {
            if (thirdPartyToEdit) {
                await updateThirdParty({ id: thirdPartyToEdit.id, ...data }).unwrap();
                toast.success('Fiche tiers mise à jour avec succès');
            } else {
                await createThirdParty(data as any).unwrap();
                toast.success('Nouveau tiers enregistré');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Échec de l’opération', { description: error.data?.message || 'Vérifiez la connexion ou les doublons.' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-drc-blue/20 p-2 rounded-xl backdrop-blur-sm border border-drc-blue/30">
                                <Users2 className="h-5 w-5 text-drc-blue" />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-1 w-2 bg-drc-blue rounded-full pulse" />
                                <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                                <div className="h-1 w-2 bg-drc-red rounded-full" />
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            {thirdPartyToEdit ? 'ÉDITION TIERS' : 'NOUVELLE FICHE'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Gestion centralisée des partenaires d'affaires (Clients & Fournisseurs).
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Section: Informations Générales */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Identité Commerciale</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control as any}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Type de partenaire</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={!!initialType}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:ring-4 focus:ring-drc-blue/10 transition-all font-bold disabled:opacity-70 disabled:cursor-not-allowed">
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                                        <SelectItem value={ThirdPartyType.CUSTOMER} className="font-bold">CLIENT</SelectItem>
                                                        <SelectItem value={ThirdPartyType.SUPPLIER} className="font-bold">FOURNISSEUR</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Raison Sociale / Nom</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ex: MILELE SERVICES SARL" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold uppercase" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section: Identifiants Fiscaux */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Enregistrement Légal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control as any}
                                        name="taxId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                    <Landmark className="h-3 w-3 text-slate-400" /> N° I.D. NAT / NIF
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="rccm"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">RCCM</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="CD/KNG/RCCM/..." className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono font-bold" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section: Coordonnées */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Coordonnées & Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control as any}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                        <Input type="email" {...field} className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700">Téléphone</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                        <Input {...field} className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control as any}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-bold text-slate-700">Adresse Physique</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                                    <textarea {...field} rows={2} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 transition-all font-medium text-sm outline-none" placeholder="N° 12, Av. de la Paix, Kinshasa/Gombe" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Section: Paramètres Financiers */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Conditions Commerciales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control as any}
                                        name="isVatSubject"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-600">Assujetti TVA</FormLabel>
                                                    <FormDescription className="text-[10px]">Appliquer la TVA sur les factures</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-drc-blue" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="creditLimit"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                    <Wallet className="h-3 w-3 text-slate-400" /> Limite de crédit (USD)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-black text-drc-blue" />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50 border-slate-100 transition-all"
                                >
                                    Fermer
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-12 px-8 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>{thirdPartyToEdit ? 'Mettre à jour' : 'Enregistrer Tiers'}</span>
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
