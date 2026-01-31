import { Role, User } from '@/features/auth/types';

// Response types moved to end using PaginatedResponse

export interface CreateUserRequest {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    roleId: number;
    companyId: number;
    isActive?: boolean;
}

export interface Company {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    createdAt: string;
}

// Response types moved to end using PaginatedResponse

export interface CreateCompanyRequest {
    name: string;
    email?: string;
    phone?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
    id: number;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'passwordHash'>> {
    id: number;
    passwordHash?: string;
}

// Roles
// Response types moved to end using PaginatedResponse

export interface CreateRoleRequest {
    code: string; // e.g., 'ACCOUNTANT'
    label: string; // e.g., 'Comptable'
    permissions?: any; // JSON
    companyId?: number;
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
    id: number;
}

// Branches
export interface Branch {
    id: number;
    name: string;
    code: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    companyId: number;
    createdAt: string;
}

// Response types moved to end using PaginatedResponse

export interface CreateBranchRequest {
    name: string;
    code: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    companyId: number;
}

export interface UpdateBranchRequest extends Partial<CreateBranchRequest> {
    id: number;
}

// Audit Logs
export interface AuditLog {
    id: string; // BigInt as string
    entityType: string;
    entityId: string; // BigInt as string
    action: string;
    changes?: {
        before?: any;
        after?: any;
        [key: string]: any;
    };
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: number;
    user?: User;
    companyId: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        last_page: number;
        limit: number;
    };
}

export type UserListResponse = PaginatedResponse<User>;
export type CompanyListResponse = PaginatedResponse<Company>;
export type RoleListResponse = PaginatedResponse<Role>;
export type BranchListResponse = PaginatedResponse<Branch>;
export type AuditLogListResponse = PaginatedResponse<AuditLog>;
export type LegalDocumentListResponse = PaginatedResponse<LegalDocument>;

// Legal Documents
export interface LegalDocument {
    id: number;
    title: string;
    type: 'terms' | 'privacy' | 'gdpr' | 'other';
    content: string;
    version: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Response types moved to end using PaginatedResponse

export interface CreateLegalDocumentRequest {
    title: string;
    type: string;
    content: string;
    version: string;
}

// System Setup
export interface SystemSetup {
    id: number;
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;
    currency?: string;
    timezone?: string;
    dateFormat?: string;
    fiscalYearStart?: string;
    taxNumber?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    updatedAt: string;
}

export interface UpdateSystemSetupRequest extends Partial<Omit<SystemSetup, 'id' | 'updatedAt'>> {
}
