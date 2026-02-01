'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { useLoginMutation } from '../api/authApi';
import { loginSchema, LoginSchema } from '../schemas';
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
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'sonner';

export const LoginForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginSchema) {
        try {
            const response = await login(data).unwrap();
            dispatch(setCredentials({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            }));
            toast.success('Accès autorisé', {
                description: `Bienvenue, ${response.user.firstName}.`
            });
            router.push('/dashboard');
        } catch (error: any) {
            const errorCode = error.data?.code;
            const message = error.data?.message;

            if (error.status === 'FETCH_ERROR') {
                toast.error('Erreur de connexion', {
                    description: "Impossible de joindre le serveur. Vérifiez votre connexion internet.",
                });
            } else if (errorCode === 'COMPANY_INACTIVE') {
                toast.error('Entreprise non activée', {
                    description: message || "Votre entreprise est en attente de validation par l'administrateur.",
                });
            } else if (errorCode === 'ACCOUNT_LOCKED') {
                toast.error('Compte verrouillé', {
                    description: message || "Trop d'essais infructueux. Réessayez plus tard.",
                });
            } else if (errorCode === 'ACCOUNT_DISABLED') {
                toast.error('Compte désactivé', {
                    description: message || "Votre accès a été suspendu par un administrateur.",
                });
            } else if (errorCode === 'INVALID_CREDENTIALS') {
                toast.error('Identification Échouée', {
                    description: "Vos identifiants sont incorrects. Veuillez vérifier votre email et mot de passe.",
                });
            } else {
                toast.error('Oups ! Un problème est survenu', {
                    description: message || "Une erreur technique empêche la connexion. Nos équipes sont sur le coup.",
                });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Email Professionnel</FormLabel>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        placeholder="nom@entreprise.cd"
                                        {...field}
                                        className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase tracking-tight" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Mot de Passe</FormLabel>
                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-drc-blue hover:text-blue-700 transition-colors">Oublié ?</button>
                            </div>
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-drc-blue transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...field}
                                        className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold uppercase tracking-tight" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-drc-blue hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "S'authentifier"
                    )}
                </Button>
            </form>
        </Form>
    );
};
