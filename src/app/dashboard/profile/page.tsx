'use client';

import { useForm } from 'react-hook-form';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/features/auth/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2, User, Mail, ShieldCheck, Save, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import React, { useEffect } from 'react';

const ProfileCard = ({ title, description, icon: Icon, children }: { title: string, description?: string, icon: any, children: React.ReactNode }) => (
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

export default function ProfilePage() {
    const { data: profile, isLoading } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const form = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (profile) {
            form.reset({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                password: '',
            });
        }
    }, [profile, form]);

    const onSubmit = async (values: any) => {
        try {
            const updateData: any = {
                firstName: values.firstName,
                lastName: values.lastName,
            };
            if (values.password) {
                updateData.password = values.password;
            }
            await updateProfile(updateData).unwrap();
            toast.success('Profil mis à jour', {
                description: 'Vos informations personnelles ont été enregistrées avec succès.',
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            });
            form.setValue('password', '');
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
                <span className="font-bold text-slate-400 uppercase tracking-widest animate-pulse">Chargement du profil...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl py-10 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <User className="h-3 w-3" />
                        Mon Compte
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Profil Utilisateur</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez vos informations personnelles et votre sécurité.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileCard
                            title="Informations Personnelles"
                            description="Identité et contact"
                            icon={User}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                Prénom
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jean" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                Nom
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dupont" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> Adresse Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled placeholder="user@example.com" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold opacity-70" />
                                        </FormControl>
                                        <FormDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">L'adresse email ne peut pas être modifiée.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </ProfileCard>

                        <ProfileCard
                            title="Sécurité"
                            description="Mot de passe et authentification"
                            icon={KeyRound}
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            Nouveau mot de passe
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Laissez vide pour conserver le mot de passe actuel.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight">Authentification 2FA</h4>
                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Actuellement {profile?.isTwoFactorEnabled ? 'activée' : 'désactivée'}</p>
                                    </div>
                                </div>
                            </div>
                        </ProfileCard>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isUpdating}
                            className="h-14 px-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black shadow-xl transition-all active:scale-95"
                        >
                            {isUpdating ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-5 w-5" />
                            )}
                            ENREGISTRER LES MODIFICATIONS
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
