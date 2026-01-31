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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/features/auth/lib/auth-provider';
import { extractArray } from '@/lib/utils';
// You might need a way to fetch roles, for now we hardcode or pass them
// Assuming roles are statically available or fetched elsewhere

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
                passwordHash: '', // Clear passwordHash field on edit
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
        try {
            if (userToEdit) {
                // Remove passwordHash if empty
                const updateData: any = { ...data };
                if (!updateData.passwordHash) {
                    delete updateData.passwordHash;
                }
                await updateUser({ id: userToEdit.id, ...updateData }).unwrap();
                toast.success('Utilisateur mis à jour');
            } else {
                if (!data.passwordHash) {
                    toast.error('Le mot de passe est requis pour un nouvel utilisateur');
                    return;
                }
                // Inject companyId from current user
                const createData = {
                    ...data,
                    companyId: currentUser?.companyId || 1, // Fallback to 1 if not found
                };
                await createUser(createData as any).unwrap();
                toast.success('Utilisateur créé');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{userToEdit ? 'Modifier utilisateur' : 'Ajouter utilisateur'}</DialogTitle>
                    <DialogDescription>
                        {userToEdit ? 'Modifiez les informations ci-dessous.' : 'Remplissez les informations pour créer un nouvel utilisateur.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control as any}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom d'utilisateur</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="jdoe" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control as any}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control as any}
                            name="passwordHash"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{userToEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control as any}
                            name="roleIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rôles</FormLabel>
                                    <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                                        {isLoadingRoles ? <Loader2 className="h-4 w-4 animate-spin" /> : roles.map((role: Role) => (
                                            <div key={role.id} className="flex items-center space-x-2">
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
                                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <label htmlFor={`role-${role.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {role.label || role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control as any}
                            name="branchId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Succursale</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === "none" ? undefined : parseInt(val))}
                                        value={field.value ? field.value.toString() : "none"}
                                        disabled={isLoadingBranches}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={isLoadingBranches ? "Chargement..." : "Siège Social (Par défaut)"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune (Siège Social)</SelectItem>
                                            {branches.map((branch: Branch) => (
                                                <SelectItem key={branch.id} value={branch.id.toString()}>{branch.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {userToEdit ? 'Enregistrer' : 'Créer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}
