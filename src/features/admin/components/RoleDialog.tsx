'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, RoleSchema } from '../schemas';
import { useCreateRoleMutation, useUpdateRoleMutation } from '../api/adminApi';
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
import {
    Shield,
    Key,
    Loader2,
    BadgeCheck,
    Wrench
} from 'lucide-react';
import { Role } from '@/features/auth/types';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { PERMISSIONS, PERMISSION_GROUPS } from '@/features/auth/lib/permissions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface RoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roleToEdit?: Role | null;
}

export function RoleDialog({ open, onOpenChange, roleToEdit }: RoleDialogProps) {
    const { companyId } = useAuth();
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
    const isLoading = isCreating || isUpdating;

    const form = useForm<RoleSchema>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            code: '',
            label: '',
            permissions: [],
            companyId: Number(companyId) || 1,
        },
    });

    useEffect(() => {
        if (roleToEdit) {
            form.reset({
                code: roleToEdit.code,
                label: roleToEdit.label ?? '',
                permissions: roleToEdit.permissions || [],
                companyId: roleToEdit.companyId,
            });
        }
    }, [roleToEdit, form]);

    const onSubmit: SubmitHandler<RoleSchema> = async (data) => {
        const toastId = toast.loading(roleToEdit ? 'Mise à jour du profil...' : 'Création du profil...');
        try {
            if (!companyId) {
                toast.error("Session invalide", { id: toastId });
                return;
            }

            const payload = { ...data, permissions: data.permissions };

            if (roleToEdit) {
                await updateRole({ id: roleToEdit.id, ...payload }).unwrap();
                toast.success('Rôle mis à jour', { id: toastId });
            } else {
                await createRole(payload as any).unwrap();
                toast.success('Rôle créé avec succès', { id: toastId });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Échec de l\'opération', { id: toastId, description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    const applyShortcut = (label: string, code: string, perms: string[]) => {
        form.setValue('label', label);
        form.setValue('code', code);
        form.setValue('permissions', perms);
        toast.info(`Profil ${label} appliqué`, { duration: 2000 });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-emerald-500/20 p-2 rounded-xl backdrop-blur-sm border border-emerald-500/30">
                                <Shield className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Contrôle d'Accès Sécurisé
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            {roleToEdit ? 'Configuration du Rôle' : 'Définition d\'un Rôle'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Paramétrage des habilitations et privilèges utilisateurs.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Libellé Fonctionnel</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                                    <Input
                                                        {...field}
                                                        placeholder="Ex: Comptable Senior"
                                                        className="h-11 pl-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:ring-emerald-500/20"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            field.onChange(e);
                                                            if (!roleToEdit) {
                                                                const generatedCode = e.target.value
                                                                    .toUpperCase()
                                                                    .replace(/\s+/g, '_')
                                                                    .replace(/[^A-Z0-9_]/g, '');
                                                                form.setValue('code', generatedCode);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Identifiant Système (Code)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} disabled={!!roleToEdit} className={`h-11 pl-9 rounded-xl border-slate-100 font-mono font-bold text-xs uppercase ${roleToEdit ? 'bg-slate-100/50 text-slate-400' : 'bg-slate-50/50 text-emerald-600'}`} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pb-1">
                                    <Wrench className="h-3 w-3" /> Modèles de Rôles Standards
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-[10px] font-black tracking-tight h-9 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                                        onClick={() => applyShortcut('Le Caissier', 'CASHIER', [PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_WRITE, PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_WRITE])}
                                    >
                                        CAISSIER DE POINT DE VENTE
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-[10px] font-black tracking-tight h-9 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                                        onClick={() => applyShortcut('Comptable', 'ACCOUNTANT', [PERMISSIONS.ACCOUNTS_READ, PERMISSIONS.ENTRIES_WRITE, PERMISSIONS.REPORTS_READ, PERMISSIONS.INVOICES_READ])}
                                    >
                                        COMPTABLE GÉNÉRAL
                                    </Button>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <FormLabel className="text-xs font-black uppercase tracking-wider text-slate-900">Matrice des habilitations</FormLabel>
                                                <FormDescription className="text-[10px] font-medium text-slate-400">Croisement des modules et des droits d'action.</FormDescription>
                                            </div>
                                            <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-bold px-3">
                                                {(field.value as string[])?.length || 0} permissions sélectionnées
                                            </Badge>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                            <ScrollArea className="h-[350px] bg-white">
                                                <div className="p-4 space-y-8">
                                                    {PERMISSION_GROUPS.map((group) => (
                                                        <div key={group.label} className="space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-100/50">
                                                                    {group.label}
                                                                </h4>
                                                                <div className="h-[1px] flex-1 bg-slate-50" />
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {group.permissions.map((perm) => (
                                                                    <div
                                                                        key={perm.id}
                                                                        className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer group select-none ${(field.value as string[])?.includes(perm.id)
                                                                            ? 'border-emerald-200 bg-emerald-50/30'
                                                                            : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                                                                            }`}
                                                                        onClick={() => {
                                                                            const current = (field.value as string[]) || [];
                                                                            const isChecked = current.includes(perm.id);
                                                                            const next = isChecked
                                                                                ? current.filter(id => id !== perm.id)
                                                                                : [...current, perm.id];
                                                                            field.onChange(next);
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            id={perm.id}
                                                                            checked={(field.value as string[])?.includes(perm.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                const current = (field.value as string[]) || [];
                                                                                const next = checked
                                                                                    ? [...current, perm.id]
                                                                                    : current.filter(id => id !== perm.id);
                                                                                field.onChange(next);
                                                                            }}
                                                                            className="mt-0.5 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                                                        />
                                                                        <div className="grid gap-1 leading-none">
                                                                            <Label className="text-xs font-black text-slate-700 cursor-pointer">{perm.label}</Label>
                                                                            <span className="text-[9px] font-mono text-slate-400 group-hover:text-emerald-500 transition-colors uppercase">{perm.id}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400">
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-10 h-11 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (roleToEdit ? 'Mettre à jour le profil' : 'Finaliser la création')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
