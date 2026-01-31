'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react';
import { useState } from 'react';
import { authApi } from '../api/authApi';
import { registerSchema, RegisterSchema } from '../schemas';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const RegisterForm = () => {
    const router = useRouter();
    const [register, { isLoading }] = authApi.useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            companyName: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: RegisterSchema) {
        try {
            const { confirmPassword, ...registerData } = data;
            await register(registerData).unwrap();
            toast.success('Compte créé avec succès', {
                description: 'Veuillez vérifier votre email pour activer votre compte.',
            });
            router.push('/login');
        } catch (error: any) {
            console.error('Registration failed', JSON.stringify(error, null, 2) || error);

            const errorMessage = error.data?.message;
            let description = 'Une erreur est survenue lors de la création du compte.';

            if (Array.isArray(errorMessage)) {
                // Map NestJS validation errors to fields
                errorMessage.forEach((msg: string) => {
                    const lowerMsg = msg.toLowerCase();
                    if (lowerMsg.includes('email')) {
                        form.setError('email', { message: msg });
                    } else if (lowerMsg.includes('password')) {
                        form.setError('password', { message: msg });
                    } else if (lowerMsg.includes('first name') || lowerMsg.includes('firstname')) {
                        form.setError('firstName', { message: msg });
                    } else if (lowerMsg.includes('last name') || lowerMsg.includes('lastname')) {
                        form.setError('lastName', { message: msg });
                    } else if (lowerMsg.includes('company')) {
                        form.setError('companyName', { message: msg });
                    }
                });
                description = errorMessage[0];
            } else if (typeof errorMessage === 'string') {
                description = errorMessage;
                // Handle specific conflict messages
                if (description.toLowerCase().includes('email') && description.toLowerCase().includes('existe')) {
                    form.setError('email', { message: description });
                }
            } else if (error.status === 500) {
                description = `Erreur Serveur (500). Veuillez contacter le support.`;
            }

            toast.error(`Échec de l'inscription ${error.status ? `(${error.status})` : ''}`, {
                description: description,
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prénom</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <Input
                                            placeholder="John"
                                            {...field}
                                            className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nom</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <Input
                                            placeholder="Doe"
                                            {...field}
                                            className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Professionnel</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        placeholder="john@company.cd"
                                        {...field}
                                        className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nom de l'Entreprise</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <Input
                                        placeholder="Milele Business Sarl"
                                        {...field}
                                        className="h-12 pl-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mot de Passe</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...field}
                                        className="h-12 pl-12 pr-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
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
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Confirmation</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...field}
                                        className="h-12 pl-12 pr-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-drc-blue hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                        "Créer mon compte Milele"
                    )}
                </Button>
            </form>
        </Form>
    );
};
