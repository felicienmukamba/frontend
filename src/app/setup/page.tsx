'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
    Building2,
    User,
    Lock,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    MapPin,
    Phone,
    Mail,
    FileText,
    ShieldCheck,
    Globe,
    Briefcase,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useInitializeMutation, useGetSystemStatusQuery } from '@/features/admin/api/setupApi';
import { toast } from 'sonner';
import Image from 'next/image';

const setupSchema = z.object({
    // Step 1: Company
    companyName: z.string().min(2, "Nom de l'entreprise requis"),
    taxId: z.string().min(5, "NIF requis"),
    nationalId: z.string().min(5, "ID National requis"),
    rccm: z.string().min(5, "RCCM requis"),
    address: z.string().min(5, "Adresse requise"),
    phone: z.string().min(10, "Téléphone requis"),
    email: z.string().email("Email de l'entreprise invalide"),
    taxRegime: z.string().min(2, "Régime fiscal requis"),
    taxCenter: z.string().min(2, "Centre fiscal requis"),

    // Step 2: Branch
    mainBranchName: z.string().min(2, "Nom de la succursale requis"),
    mainBranchCode: z.string().min(2, "Code requis").toUpperCase(),

    // Step 3: Admin
    adminFirstName: z.string().min(2, "Prénom requis"),
    adminLastName: z.string().min(2, "Nom requis"),
    adminEmail: z.string().email("Email personnel requis"),
    adminPassword: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string()
}).refine(data => data.adminPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
});

type SetupFormValues = z.infer<typeof setupSchema>;

export default function SetupPage() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [initialize, { isLoading }] = useInitializeMutation();

    const form = useForm<SetupFormValues>({
        resolver: zodResolver(setupSchema),
        defaultValues: {
            companyName: '',
            taxId: '',
            nationalId: '',
            rccm: '',
            address: '',
            phone: '',
            email: '',
            taxRegime: 'REEL',
            taxCenter: 'DGE',
            mainBranchName: 'Siège Social',
            mainBranchCode: 'HQ-01',
            adminFirstName: '',
            adminLastName: '',
            adminEmail: '',
            adminPassword: '',
            confirmPassword: '',
        }
    });

    const nextStep = async () => {
        const fieldsByStep: Record<number, (keyof SetupFormValues)[]> = {
            1: ['companyName', 'taxId', 'nationalId', 'rccm', 'address', 'phone', 'email', 'taxRegime', 'taxCenter'],
            2: ['mainBranchName', 'mainBranchCode'],
            3: ['adminFirstName', 'adminLastName', 'adminEmail', 'adminPassword', 'confirmPassword']
        };

        const isValid = await form.trigger(fieldsByStep[step as 1 | 2 | 3]);

        if (isValid) {
            setStep(s => s + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const errors = form.formState.errors;
            const firstErrorField = Object.keys(errors).find(key => fieldsByStep[step as 1 | 2 | 3].includes(key as any));
            if (firstErrorField) {
                toast.error("Veuillez corriger les erreurs avant de continuer", {
                    description: (errors as any)[firstErrorField]?.message
                });
            }
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const onSubmit = async (data: SetupFormValues) => {
        try {
            const { confirmPassword, ...initData } = data;
            await initialize(initData).unwrap();

            // Re-render state to show success screen or toast
            toast.success('Demande d\'inscription envoyée !', {
                description: 'Votre entreprise a été créée avec succès. Elle est actuellement en attente d\'activation par le Super-Administrateur du SaaS.',
                duration: 10000,
            });

            // In a real SaaS, we might redirect to a "Pending" page
            // For now, redirect to login where they will see the "Inactive" message
            router.push('/login');
        } catch (error: any) {
            toast.error('Échec de la configuration', {
                description: error.data?.message || 'Une erreur est survenue lors de l\'initialisation.'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-start py-8 md:py-20 px-4 scroll-smooth">
            {/* Header / Brand */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8 md:mb-12"
            >
                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <Image src="/icon.png" alt="Milele" width={32} height={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-outfit">Milele Accounting</h1>
                    <div className="flex gap-1 mt-0.5">
                        <div className="h-1 w-3 bg-drc-blue rounded-full" />
                        <div className="h-1 w-3 bg-drc-yellow rounded-full" />
                        <div className="h-1 w-3 bg-drc-red rounded-full" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.08)] border border-slate-100/80 overflow-hidden flex flex-col md:flex-row"
            >
                {/* Sidebar Info - Progressive Step Indicator */}
                <div className="md:w-[320px] bg-slate-950 p-10 md:p-14 text-white relative flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,121,194,0.15)_0,transparent_60%)]" />

                    <div className="relative z-10 space-y-16">
                        <div className="space-y-12">
                            {[
                                { s: 1, t: 'ENTREPRISE', d: 'Identité fiscale & sociale', icon: Briefcase },
                                { s: 2, t: 'OPÉRATIONS', d: 'Votre première succursale', icon: Globe },
                                { s: 3, t: 'CONTRÔLE', d: 'Compte Super-Admin', icon: ShieldCheck }
                            ].map((item) => (
                                <div key={item.s} className={cn(
                                    "flex items-center gap-5 transition-all duration-500",
                                    step !== item.s && "opacity-30 grayscale blur-[0.5px]"
                                )}>
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500",
                                        step === item.s
                                            ? "bg-drc-yellow border-0 text-slate-950 shadow-[0_0_40px_rgba(255,209,0,0.3)] rotate-0 scale-110"
                                            : "bg-white/5 border border-white/10 text-white rotate-[-10deg]"
                                    )}>
                                        {step > item.s ? <CheckCircle2 className="h-6 w-6" /> : <item.icon className="h-5 w-5" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-[0.2em] text-drc-yellow/80">{item.s < step ? 'TERMINÉ' : `Étape ${item.s}`}</span>
                                        <h3 className="font-black text-sm uppercase tracking-tight">{item.t}</h3>
                                        <p className="text-[10px] text-slate-500 font-bold font-outfit mt-0.5">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/5 mt-20">
                        <div className="flex items-center gap-2 text-drc-blue font-black text-[10px] uppercase tracking-widest mb-2">
                            <Zap className="h-3 w-3 fill-current" />
                            <span>Quick Setup Engine</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed max-w-[180px]">
                            Configuration automatisée conforme aux standards OHADA.
                        </p>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-10 md:p-16 bg-gradient-to-br from-white to-slate-50/30">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 h-full flex flex-col justify-between">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <div className="h-1 w-12 bg-drc-blue rounded-full mb-6" />
                                            <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase font-outfit">Structure Légale.</h2>
                                            <p className="text-slate-500 font-medium">Commençons par les fondations de votre entreprise en RDC.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <FormField
                                                control={form.control}
                                                name="companyName"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-full">
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Raison Sociale</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 hover:border-slate-200 focus:bg-white focus:ring-4 focus:ring-drc-blue/5 transition-all font-bold text-slate-900" placeholder="e.g. MILELE SOLUTIONS SARL" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="taxId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">NIF</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="A0000000X" />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="rccm"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">RCCM</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="CD/KNG/RCCM/..." />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="nationalId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Id. National</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="01-G4500-N..." />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Téléphone</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="+243..." />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-full">
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Email Pro</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} type="email" className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="office@milele.cd" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-full">
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Adresse Complète</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="Av. de la Justice, Kinshasa/Gombe" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <div className="h-1 w-12 bg-drc-yellow rounded-full mb-6" />
                                            <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase font-outfit">Déploiement.</h2>
                                            <p className="text-slate-500 font-medium">Milele est multi-site par défaut. Créons votre centre principal.</p>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                                    <Globe className="h-32 w-32" />
                                                </div>
                                                <div className="relative z-10 space-y-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="mainBranchName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Nom de la Succursale</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} className="h-16 rounded-2xl bg-white/10 border-white/10 text-xl font-black placeholder:text-white/20 focus:bg-white/20 transition-all" placeholder="Siège Social Kinshasa" />
                                                                </FormControl>
                                                                <FormMessage className="text-drc-red text-[10px] font-bold" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="mainBranchCode"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Code Identification</FormLabel>
                                                                <FormControl>
                                                                    <div className="flex items-center gap-4">
                                                                        <Input {...field} className="h-14 w-40 rounded-2xl bg-white/10 border-white/10 text-center font-black uppercase text-drc-yellow" placeholder="HQ-KIN" />
                                                                        <p className="text-[10px] text-white/40 font-bold max-w-xs leading-normal">
                                                                            Ce code servira de préfixe pour vos factures et documents internes.
                                                                        </p>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage className="text-drc-red text-[10px] font-bold" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
                                                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-xs">01</div>
                                                    <h4 className="font-black text-xs uppercase text-slate-900 tracking-tight">Isolation des données</h4>
                                                    <p className="text-[10px] text-slate-500 leading-normal font-medium">Chaque succursale dispose de son propre inventaire et comptabilité locale.</p>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
                                                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-xs">02</div>
                                                    <h4 className="font-black text-xs uppercase text-slate-900 tracking-tight">Consolidation</h4>
                                                    <p className="text-[10px] text-slate-500 leading-normal font-medium">Générez des états financiers consolidés au niveau de l'entreprise.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <div className="h-1 w-12 bg-emerald-500 rounded-full mb-6" />
                                            <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase font-outfit">Haut Commandement.</h2>
                                            <p className="text-slate-500 font-medium">Créez l'accès racine. Ce compte contrôlera tout le système.</p>
                                        </div>

                                        <div className="bg-emerald-50/50 border border-emerald-100/50 p-6 rounded-3xl mb-8 flex gap-4 items-start">
                                            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                                            <p className="text-[10px] text-emerald-800 font-bold leading-relaxed uppercase tracking-wider">
                                                Accès privilégié : Le Super-Admin peut voir toutes les succursales et dispose de tous les droits de modification.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="adminFirstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Prénom</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="adminLastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Nom</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="adminEmail"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-full">
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Email Personnel / Identification</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} type="email" className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" placeholder="root@milele.cd" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="adminPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Mot de passe Root</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} type="password" className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Confirmation</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-drc-blue transition-colors" />
                                                                <Input {...field} type="password" className="pl-14 h-14 rounded-2xl bg-slate-50 border-slate-100 transition-all font-bold" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-12 mt-auto flex items-center justify-between">
                                {step > 1 ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={prevStep}
                                        className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-100 group transition-all"
                                    >
                                        <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                        Retour
                                    </Button>
                                ) : <div />}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="h-16 px-12 rounded-3xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest group shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]"
                                    >
                                        Continuer
                                        <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-16 px-16 rounded-3xl bg-drc-blue hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-[0.95] transition-all"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                Finaliser l'Installation
                                                <RocketIcon className="h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </div>
            </motion.div>

            {/* Bottom Credit */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]"
            >
                Milele Accounting System &copy; 2026
            </motion.p>
        </div>
    );
}

// Custom Icons / Helpers
function RocketIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.59.79-1.54.19-2.14z" />
            <path d="M7 10c.84-2.11 2.34-4.22 4.17-5.83a2 2 0 0 1 2.83 0L14 4.17m-4.17 4.17A2 2 0 0 1 12.66 4.17" />
            <path d="M12 11c1.33 0 2.5-.83 2.5-2.5S13.33 6 12 6c-1.33 0-2.5.83-2.5 2.5S10.67 11 12 11Z" />
            <path d="M17.5 19c.19.19.46.3.74.3h3.26c.28 0 .55-.11.74-.3s.3-.46.3-.74v-3.26c0-.28-.11-.55-.3-.74s-.46-.3-.74-.3h-3.26c-.28 0-.55.11-.74.3s-.3.46-.3.74v3.26c0 .28.11.55.3.74Z" />
            <path d="m13.5 17.5 2 2" />
            <path d="m19 19 2-2" />
            <path d="M16 12c.55 0 1 .45 1 1s-.45 1-1 1" />
            <path d="M16 16c.55 0 1 .45 1 1s-.45 1-1 1" />
        </svg>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
