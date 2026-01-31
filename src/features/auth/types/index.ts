// Backend uses string codes like 'ADMIN', 'ACCOUNTANT', etc.
// These are stored in the Role.code field in Prisma
export enum UserRole {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN_COMPANY = 'ADMIN_COMPANY',
    ADMIN_BRANCH = 'ADMIN_BRANCH',
    CAISSIER = 'CAISSIER',
    COMPTABLE = 'COMPTABLE',
    RH = 'RH',
    DIRECTEUR_FINANCIER = 'DIRECTEUR_FINANCIER',
    GERANT = 'GERANT',
}

// Matches Prisma Role model
export interface Role {
    id: number;
    code: string;
    label: string | null;
    name?: string; // Compatibility
    description?: string | null; // Compatibility
    permissions: any; // JSON field in Prisma (stringified on backend, parsed on frontend if needed)
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

// Matches Prisma User model
export interface User {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    isSaaSAdmin: boolean;
    isTwoFactorEnabled?: boolean;
    lastLogin?: string;
    roles: Role[];
    companyId: number;
    branchId?: number;
    branch?: { id: number; name: string };
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
}
