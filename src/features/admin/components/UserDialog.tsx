'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Role } from '@/features/auth/types';
import { userSchema, UserSchema } from '../schemas';
import { Branch } from '../types';
import { useCreateUserMutation, useUpdateUserMutation, useGetRolesQuery, useGetBranchesQuery } from '../api/adminApi';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
    Plus,
    User as UserIcon,
    Mail,
    Shield,
    Building2,
    Lock,
    Loader2,
    ChevronRight,
    Search
} from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { extractArray } from '@/lib/utils';

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userToEdit?: User | null;
}

export function UserDialog({ open, onOpenChange, userToEdit }: UserDialogProps) {
    const { user: currentUser } = useAuth();
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({});
    const { data: branchesData, isLoading: isLoadingBranches } = useGetBranchesQuery({});

    const roles = extractArray<Role>(rolesData);
    const branches = extractArray<Branch>(branchesData);
    const isLoading = isCreating || isUpdating;

    const form = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            roleIds: [],
            branchId: undefined,
            passwordHash: '',
        },
    });

    useEffect(() => {
        if (userToEdit) {
            form.reset({
                firstName: userToEdit.firstName,
                lastName: userToEdit.lastName,
                username: userToEdit.username,
                email: userToEdit.email,
                roleIds: userToEdit.roles ? userToEdit.roles.map((r: any) => r.id) : (userToEdit as any).roleId ? [(userToEdit as any).roleId] : [],
                branchId: userToEdit.branchId || undefined,
                passwordHash: '',
            });
        } else {
            form.reset({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                roleIds: [],
                passwordHash: '',
            });
        }
    }, [userToEdit, form]);

    const onSubmit: SubmitHandler<UserSchema> = async (data) => {
        const toastId = toast.loading(userToEdit ? 'Mise à jour...' : 'Création...');
        try {
            if (userToEdit) {
                const updateData: any = { ...data };
                if (!updateData.passwordHash) {
                    delete updateData.passwordHash;
                }
                const response = await updateUser({ id: userToEdit.id, ...updateData }).unwrap();
                toast.success(`Utilisateur ${data.firstName} ${data.lastName} mis à jour avec succès.`, { id: toastId });
            } else {
                if (!data.passwordHash) {
                    toast.error('Le mot de passe est requis pour un nouvel utilisateur', { id: toastId });
                    return;
                }
                const createData = {
                    ...data,
                    companyId: currentUser?.companyId || 1,
                };
                const response = await createUser(createData as any).unwrap();
                toast.success(`Utilisateur ${data.firstName} ${data.lastName} créé avec succès.`, { id: toastId });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { id: toastId, description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-violet-500/20 p-2 rounded-xl backdrop-blur-sm border border-violet-500/30">
                                <UserIcon className="h-5 w-5 text-violet-400" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Administration Système
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tight">
                            {userToEdit ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-xs">
                            Gestion des accès et des permissions du personnel.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                Prenom
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:ring-violet-500/20" />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                Nom
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Identifiant (UID)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} placeholder="jdoe" className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-mono font-bold text-violet-600" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Pro</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                    <Input {...field} type="email" placeholder="email@company.com" className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control as any}
                                name="passwordHash"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                            {userToEdit ? 'Réinitialiser le mot de passe (optionnel)' : 'Mot de passe initial'}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                <Input {...field} type="password" placeholder="••••••••" className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="roleIds"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                <Shield className="h-3 w-3" /> Privilèges (Rôles)
                                            </FormLabel>
                                            <div className="border border-slate-100 rounded-xl p-3 space-y-2 max-h-32 overflow-y-auto bg-slate-50/30 custom-scrollbar">
                                                {isLoadingRoles ? (
                                                    <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-slate-400" /></div>
                                                ) : roles.map((role: Role) => (
                                                    <div key={role.id} className="flex items-center space-x-2 p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                                        <input
                                                            type="checkbox"
                                                            id={`role-${role.id}`}
                                                            value={role.id}
                                                            checked={field.value?.includes(role.id)}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                const current = field.value || [];
                                                                if (checked) {
                                                                    field.onChange([...current, role.id]);
                                                                } else {
                                                                    field.onChange(current.filter((id: number) => id !== role.id));
                                                                }
                                                            }}
                                                            className="h-4 w-4 rounded border-slate-200 text-violet-600 focus:ring-violet-500"
                                                        />
                                                        <label htmlFor={`role-${role.id}`} className="text-xs font-bold text-slate-600 cursor-pointer">
                                                            {role.label || role.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="branchId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                <Building2 className="h-3 w-3" /> Site d'affectation
                                            </FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(val === "none" ? undefined : parseInt(val))}
                                                value={field.value ? field.value.toString() : "none"}
                                                disabled={isLoadingBranches}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-xs">
                                                        <SelectValue placeholder={isLoadingBranches ? "Chargement..." : "Siège Social (Par défaut)"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-slate-100">
                                                    <SelectItem value="none" className="font-bold">Aucune (Siège Social)</SelectItem>
                                                    {branches.map((branch: Branch) => (
                                                        <SelectItem key={branch.id} value={branch.id.toString()} className="font-bold">{branch.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400">
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-violet-500/20 transition-all active:scale-95" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (userToEdit ? 'Enregistrer les modifications' : 'Créer l\'utilisateur')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
