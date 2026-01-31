'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Loader2, BookOpen, Layers, Settings2, ShieldCheck } from 'lucide-react';
import {
    useCreateAccountMutation,
    useUpdateAccountMutation,
} from '../api/accountingApi';
import { Account, CreateAccountDto, AccountType } from '../types';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGetAccountsQuery } from '../api/accountingApi';

const accountSchema = z.object({
    accountNumber: z.string().min(1, "Numéro de compte requis"),
    label: z.string().min(1, "Libellé requis"),
    accountClass: z.number().min(1).max(9),
    type: z.nativeEnum(AccountType),
    isReconcilable: z.boolean().default(false),
    isAuxiliary: z.boolean().default(false),
    parentAccountId: z.number().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountToEdit?: Account | null;
}

export function AccountDialog({ open, onOpenChange, accountToEdit }: AccountDialogProps) {
    const { user, companyId } = useAuth();
    const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
    const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();

    const form = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema) as any,
        defaultValues: {
            accountNumber: '',
            label: '',
            accountClass: 1,
            type: AccountType.ASSET,
            isReconcilable: false,
            isAuxiliary: false,
        },
    });

    useEffect(() => {
        if (accountToEdit) {
            form.reset({
                accountNumber: accountToEdit.accountNumber,
                label: accountToEdit.label,
                accountClass: accountToEdit.accountClass,
                type: accountToEdit.type,
                isReconcilable: accountToEdit.isReconcilable,
                isAuxiliary: accountToEdit.isAuxiliary,
                parentAccountId: accountToEdit.parentAccountId,
            });
        } else {
            form.reset({
                accountNumber: '',
                label: '',
                accountClass: 1,
                type: AccountType.ASSET,
                isReconcilable: false,
                isAuxiliary: false,
            });
        }
    }, [accountToEdit, form]);

    const onSubmit = async (data: AccountFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateAccountDto = {
                ...data,
                companyId: Number(companyId),
                level: data.accountNumber.length,
            };

            if (accountToEdit) {
                await updateAccount({ id: accountToEdit.id, ...payload }).unwrap();
                toast.success('Compte mis à jour avec succès');
            } else {
                await createAccount(payload).unwrap();
                toast.success('Compte créé dans le référentiel');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Opération échouée', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-drc-blue/20 p-2 rounded-xl backdrop-blur-sm border border-drc-blue/30">
                                <BookOpen className="h-5 w-5 text-drc-blue" />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-1 w-2 bg-drc-blue rounded-full" />
                                <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                                <div className="h-1 w-2 bg-drc-red rounded-full" />
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            {accountToEdit ? 'EDITION COMPTE' : 'NOUVELLE ENTRÉE'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Configuration conforme au référentiel SYSCOHADA révisé.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 bg-white">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="accountNumber"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                                <Layers className="h-3 w-3" /> Numéro de compte
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Ex: 411100"
                                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-mono font-bold text-drc-blue"
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, ''); // Uniquement chiffres
                                                        field.onChange(val);

                                                        if (val.length > 0) {
                                                            const first = parseInt(val.charAt(0));
                                                            if (!isNaN(first) && first >= 1 && first <= 9) {
                                                                form.setValue('accountClass', first);

                                                                // Inférence automatique de la nature selon SYSCOHADA
                                                                if ([1, 4].includes(first)) form.setValue('type', AccountType.LIABILITY);
                                                                else if ([2, 3, 5].includes(first)) form.setValue('type', AccountType.ASSET);
                                                                else if (first === 6) form.setValue('type', AccountType.EXPENSE);
                                                                else if (first === 7) form.setValue('type', AccountType.REVENUE);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="accountClass"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                                <Settings2 className="h-3 w-3" /> Classe (1-9)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    min="1"
                                                    max="9"
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                    className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Libellé du compte</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Clients - Ventes de biens et services"
                                                className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold uppercase"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nature du compte</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(value as AccountType)} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                                <SelectItem value={AccountType.ASSET} className="font-bold">ACTIF</SelectItem>
                                                <SelectItem value={AccountType.LIABILITY} className="font-bold">PASSIF</SelectItem>
                                                <SelectItem value={AccountType.EXPENSE} className="font-bold">CHARGE</SelectItem>
                                                <SelectItem value={AccountType.REVENUE} className="font-bold">PRODUIT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="parentAccountId"
                                render={({ field }) => (
                                    <AccountParentSelector field={field} />
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="isReconcilable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-600">Lettrable</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-drc-blue" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isAuxiliary"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-600">Auxiliaire</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-drc-yellow" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-50 border-slate-100 transition-all"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="h-12 px-8 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    {(isCreating || isUpdating) ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>{accountToEdit ? 'Confirmer Coordonnées' : 'Enregistrer Compte'}</span>
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

function AccountParentSelector({ field }: { field: any }) {
    const { data: accountsData, isLoading } = useGetAccountsQuery();
    const accounts = Array.isArray(accountsData) ? accountsData : accountsData?.data || [];

    return (
        <FormItem className="space-y-2">
            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Compte Parent (Optionnel)</FormLabel>
            <Select
                onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                value={field.value?.toString() || "none"}
            >
                <FormControl>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:ring-4 focus:ring-drc-blue/10 focus:border-drc-blue/30 transition-all font-bold">
                        <SelectValue placeholder={isLoading ? "Chargement..." : "Choisir un parent"} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-slate-100 shadow-2xl max-h-[200px]">
                    <SelectItem value="none" className="font-bold">AUCUN (RACINE)</SelectItem>
                    {accounts.map((acc: Account) => (
                        <SelectItem key={acc.id} value={acc.id.toString()} className="font-mono">
                            {acc.accountNumber} - {acc.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage className="text-[10px] font-bold" />
        </FormItem>
    );
}
