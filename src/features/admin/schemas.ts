import { z } from 'zod';
import { UserRole } from '@/features/auth/types';

export const userSchema = z.object({
    firstName: z.string().min(2, 'Le prénom est requis'),
    lastName: z.string().min(2, 'Le nom est requis'),
    username: z.string().min(3, "Le nom d'utilisateur doit avoir au moins 3 caractères"),
    email: z.string().email('Email invalide'),
    roleIds: z.array(z.number()).min(1, 'Au moins un rôle est requis'),
    branchId: z.number().optional(),
    passwordHash: z.string().min(6, 'Le mot de passe doit avoir au moins 6 caractères').optional().or(z.literal('')),
});

export type UserSchema = z.infer<typeof userSchema>;

export const companySchema = z.object({
    name: z.string().min(2, 'Le nom de l\'entreprise est requis'),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url('URL invalide').optional().or(z.literal('')),
});

export type CompanySchema = z.infer<typeof companySchema>;

export const roleSchema = z.object({
    code: z.string().optional(),
    label: z.string().min(2, 'Libellé requis'),
    permissions: z.any().optional(),
    companyId: z.number().optional(),
});

export type RoleSchema = z.infer<typeof roleSchema>;

export const branchSchema = z.object({
    name: z.string().min(2, 'Le nom de la succursale est requis'),
    code: z.string().min(2, 'Le code est requis').toUpperCase(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    companyId: z.number().min(1, 'L\'entreprise est requise'),
    isMain: z.boolean().optional(),
});

export type BranchSchema = z.infer<typeof branchSchema>;

export const legalDocumentSchema = z.object({
    title: z.string().min(2, 'Le titre est requis'),
    type: z.enum(['terms', 'privacy', 'gdpr', 'other']),
    content: z.string().min(10, 'Le contenu est requis'),
    version: z.string().min(1, 'La version est requise'),
});

export type LegalDocumentSchema = z.infer<typeof legalDocumentSchema>;
