'use client';

import { useForm } from 'react-hook-form';
import { useGetSystemSetupQuery, useUpdateSystemSetupMutation } from '../api/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2, Settings2, Building2, Palette, Globe, Clock, Calendar, ShieldCheck, Mail, Phone, Hash, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { BadgeDRC } from '@/components/ui/PremiumTable';

const SettingsCard = ({ title, description, icon: Icon, children }: { title: string, description?: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                    {description && <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{description}</p>}
                </div>
            </div>
        </div>
        <div className="p-8 space-y-6 flex-1 bg-white/50">
            {children}
        </div>
    </div>
);

export const SystemSetup = () => {
    const { data, isLoading } = useGetSystemSetupQuery();
    const [updateSetup, { isLoading: isUpdating }] = useUpdateSystemSetupMutation();

    const form = useForm({
        defaultValues: {
            companyName: '',
            companyEmail: '',
            companyPhone: '',
            currency: 'USD',
            timezone: 'Africa/Kinshasa',
            dateFormat: 'DD/MM/YYYY',
            fiscalYearStart: '01-01',
            taxNumber: '',
            primaryColor: '#8b5cf6',
            secondaryColor: '#06b6d4',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                companyName: data.companyName || '',
                companyEmail: data.companyEmail || '',
                companyPhone: data.companyPhone || '',
                currency: data.currency || 'USD',
                timezone: data.timezone || 'Africa/Kinshasa',
                dateFormat: data.dateFormat || 'DD/MM/YYYY',
                fiscalYearStart: data.fiscalYearStart || '01-01',
                taxNumber: data.taxNumber || '',
                primaryColor: data.primaryColor || '#8b5cf6',
                secondaryColor: data.secondaryColor || '#06b6d4',
            });
        }
    }, [data, form]);

    const onSubmit = async (values: any) => {
        try {
            await updateSetup(values).unwrap();
            toast.success('Configuration mise à jour', {
                description: 'Les paramètres du système ont été enregistrés avec succès.',
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            });
        } catch (error: any) {
            toast.error('Erreur de mise à jour', {
                description: error.data?.message || 'Une erreur est survenue lors de l\'enregistrement.',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-12 w-12 animate-spin text-drc-blue mb-4" />
                <span className="font-bold text-slate-400 uppercase tracking-widest animate-pulse">Chargement de la configuration...</span>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <Settings2 className="h-3 w-3" />
                        Administration Système
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Paramètres Généraux</h2>
                    <p className="text-slate-500 font-medium mt-1">Configurez l'identité visuelle et les règles métier de votre organisation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <BadgeDRC variant="blue">MISE À JOUR AUTOMATIQUE</BadgeDRC>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SettingsCard
                            title="Identité Corporative"
                            description="Informations légales et contact"
                            icon={Building2}
                        >
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <Building2 className="h-3 w-3" /> Raison Sociale
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="MILELE ACCOUNTING SARL" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="taxNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Hash className="h-3 w-3" /> N° Identification Fiscale
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="A000000X" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-mono font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Phone className="h-3 w-3" /> Contact Téléphonique
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="+243 ..." {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="companyEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> Email de Contact
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="contact@milele.app" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold lowercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </SettingsCard>

                        <SettingsCard
                            title="Préférences Régionales"
                            description="Devise, Fuseau et Fiscalité"
                            icon={Globe}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Palette className="h-3 w-3" /> Devise de Référence
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="USD" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-black" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="timezone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Clock className="h-3 w-3" /> Fuseau Horaire
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Africa/Kinshasa" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="dateFormat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Calendar className="h-3 w-3" /> Format de Date
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="DD/MM/YYYY" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fiscalYearStart"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <ShieldCheck className="h-3 w-3" /> Début Exercice Fiscal
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="01-01" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                            </FormControl>
                                            <FormDescription className="text-[9px] uppercase font-bold text-slate-400 italic">Format: MM-DD (ex: 01-01)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </SettingsCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <SettingsCard title="Design" description="Couleurs de marque" icon={Palette}>
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="primaryColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Couleur Primaire</FormLabel>
                                                <div className="flex gap-3">
                                                    <FormControl>
                                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200">
                                                            <input type="color" {...field} className="absolute inset-0 h-full w-full cursor-pointer scale-150" />
                                                        </div>
                                                    </FormControl>
                                                    <Input value={field.value} onChange={field.onChange} className="h-12 rounded-xl font-mono font-bold" />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="secondaryColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Couleur Secondaire</FormLabel>
                                                <div className="flex gap-3">
                                                    <FormControl>
                                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200">
                                                            <input type="color" {...field} className="absolute inset-0 h-full w-full cursor-pointer scale-150" />
                                                        </div>
                                                    </FormControl>
                                                    <Input value={field.value} onChange={field.onChange} className="h-12 rounded-xl font-mono font-bold" />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </SettingsCard>
                        </div>
                        <div className="lg:col-span-2 flex items-center justify-center p-12 bg-slate-900 rounded-[2rem] text-white">
                            <div className="text-center space-y-4">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-2">
                                    <ShieldCheckIcon className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">Espace Sécurisé</h3>
                                <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium">Vos paramètres sont chiffrés et répliqués sur plusieurs zones pour garantir une haute disponibilité et intégrité des données.</p>
                                <div className="flex justify-center gap-2 pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isUpdating}
                                        className="h-14 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black shadow-2xl shadow-white/10 transition-all active:scale-95"
                                    >
                                        {isUpdating ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-5 w-5" />
                                        )}
                                        ENREGISTRER LES MODIFICATIONS
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

// Reuse icon mapping for consistency
const ShieldCheckIcon = ({ className }: { className?: string }) => (
    <ShieldCheck className={className} />
);
