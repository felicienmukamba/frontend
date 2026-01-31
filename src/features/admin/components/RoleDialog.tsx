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
import { Loader2 } from 'lucide-react';
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
    const { user, companyId } = useAuth();
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
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload = { ...data, permissions: data.permissions };

            if (roleToEdit) {
                await updateRole({ id: roleToEdit.id, ...payload }).unwrap();
                toast.success('Rôle mis à jour');
            } else {
                await createRole(payload as any).unwrap();
                toast.success('Rôle créé');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{roleToEdit ? 'Modifier rôle' : 'Créer un nouveau rôle'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control as any}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Libellé du rôle</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Comptable Senior"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (!roleToEdit) {
                                                    // Auto-génération du code (ex: "Le Caissier" -> "LE_CAISSIER")
                                                    const generatedCode = e.target.value
                                                        .toUpperCase()
                                                        .replace(/\s+/g, '_')
                                                        .replace(/[^A-Z0-9_]/g, '');
                                                    form.setValue('code', generatedCode);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {roleToEdit && (
                            <FormField
                                control={form.control as any}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code unique (Auto-généré)</FormLabel>
                                        <FormControl><Input {...field} disabled className="bg-slate-100 cursor-not-allowed" /></FormControl>
                                        <FormDescription>Le code est généré automatiquement et ne peut pas être modifié.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raccourcis de Profils</Label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full text-[10px] font-bold h-7"
                                    onClick={() => {
                                        form.setValue('label', 'Le Caissier');
                                        form.setValue('code', 'CASHIER');
                                        form.setValue('permissions', [
                                            PERMISSIONS.INVOICES_READ,
                                            PERMISSIONS.INVOICES_WRITE,
                                            PERMISSIONS.PRODUCTS_READ,
                                            PERMISSIONS.PRODUCTS_WRITE
                                        ]);
                                    }}
                                >
                                    Caissier (Ventes/Stock)
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full text-[10px] font-bold h-7"
                                    onClick={() => {
                                        form.setValue('label', 'Comptable');
                                        form.setValue('code', 'ACCOUNTANT');
                                        form.setValue('permissions', [
                                            PERMISSIONS.ACCOUNTS_READ,
                                            PERMISSIONS.ENTRIES_WRITE,
                                            PERMISSIONS.REPORTS_READ,
                                            PERMISSIONS.INVOICES_READ
                                        ]);
                                    }}
                                >
                                    Comptable
                                </Button>
                            </div>
                        </div>

                        <FormField
                            control={form.control as any}
                            name="permissions"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <div>
                                        <FormLabel className="text-sm font-bold">Matrice de Permissions</FormLabel>
                                        <FormDescription className="text-xs">Activez les droits d'accès spécifiques pour ce profil.</FormDescription>
                                    </div>
                                    <ScrollArea className="h-[300px] pr-4 rounded-xl border border-slate-100 p-4">
                                        <div className="space-y-6">
                                            {PERMISSION_GROUPS.map((group) => (
                                                <div key={group.label} className="space-y-3">
                                                    <h4 className="text-[10px] font-black uppercase tracking-tighter text-drc-blue bg-blue-50/50 px-2 py-1 rounded w-fit italic">
                                                        {group.label}
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {group.permissions.map((perm) => (
                                                            <div key={perm.id} className="flex items-center space-x-3 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
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
                                                                />
                                                                <div className="grid gap-1.5 leading-none">
                                                                    <Label
                                                                        htmlFor={perm.id}
                                                                        className="text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                                    >
                                                                        {perm.label}
                                                                    </Label>
                                                                    <span className="text-[9px] font-mono text-slate-400">{perm.id}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {roleToEdit ? 'Enregistrer' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
