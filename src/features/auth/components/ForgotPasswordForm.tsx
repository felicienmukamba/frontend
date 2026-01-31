'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordSchema } from '../schemas';
import { useForgotPasswordMutation } from '../api/authApi';
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
import Link from 'next/link';

export const ForgotPasswordForm = () => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(data: ForgotPasswordSchema) {
        try {
            await forgotPassword({ email: data.email }).unwrap();
            toast.success('Procédure lancée', {
                description: 'Si un compte existe avec cet email, un lien de récupération a été envoyé.',
            });
        } catch (error: any) {
            const message = error?.data?.message || "Une erreur s'est produite lors de l’envoi de l’email.";
            toast.error('Erreur technique', {
                description: message,
            });
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
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Email de récupération</FormLabel>
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

                <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-drc-blue hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                        "Envoyer le lien de secours"
                    )}
                </Button>

                <div className="pt-4 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Retour à la connexion
                    </Link>
                </div>
            </form>
        </Form>
    );
};
