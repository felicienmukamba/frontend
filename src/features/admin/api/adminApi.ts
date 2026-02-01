import { api } from '@/services/api';
import {
    UserListResponse, CreateUserRequest, UpdateUserRequest,
    CompanyListResponse, CreateCompanyRequest, UpdateCompanyRequest, Company,
    RoleListResponse, CreateRoleRequest, UpdateRoleRequest,
    BranchListResponse, CreateBranchRequest, UpdateBranchRequest, Branch,
    AuditLogListResponse, AuditLog,
    LegalDocumentListResponse, CreateLegalDocumentRequest, LegalDocument,
    SystemSetup, UpdateSystemSetupRequest
} from '../types';
import { User, Role } from '@/features/auth/types';

export const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserListResponse, { page?: number; limit?: number; companyId?: number }>({
            query: (params) => ({
                url: '/users',
                params,
            }),
            providesTags: ['User'],
        }),
        createUser: builder.mutation<User, CreateUserRequest>({
            query: (data) => ({
                url: '/users',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<User, UpdateUserRequest>({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        getCompanies: builder.query<CompanyListResponse, { page?: number; limit?: number; companyId?: number }>({
            query: (params) => ({
                url: '/companies',
                params,
            }),
            providesTags: ['Company'],
        }),
        createCompany: builder.mutation<Company, CreateCompanyRequest>({
            query: (data) => ({
                url: '/companies',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Company'],
        }),
        updateCompany: builder.mutation<Company, UpdateCompanyRequest>({
            query: ({ id, ...data }) => ({
                url: `/companies/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Company'],
        }),
        deleteCompany: builder.mutation<void, number>({
            query: (id) => ({
                url: `/companies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Company'],
        }),
        // Roles
        getRoles: builder.query<RoleListResponse, { page?: number; limit?: number; companyId?: number }>({
            query: (params) => ({
                url: '/roles',
                params,
            }),
            providesTags: ['Role'],
        }),
        createRole: builder.mutation<Role, CreateRoleRequest>({
            query: (data) => ({
                url: '/roles',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Role'],
        }),
        updateRole: builder.mutation<Role, UpdateRoleRequest>({
            query: ({ id, ...data }) => ({
                url: `/roles/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Role'],
        }),
        deleteRole: builder.mutation<void, number>({
            query: (id) => ({
                url: `/roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Role'],
        }),
        duplicateRole: builder.mutation<Role, number>({
            query: (id) => ({
                url: `/roles/${id}/duplicate`,
                method: 'POST',
            }),
            invalidatesTags: ['Role'],
        }),
        // Branches
        getBranches: builder.query<BranchListResponse, { page?: number; limit?: number; companyId?: number }>({
            query: (params) => ({
                url: '/administration/branches',
                params,
            }),
            providesTags: ['Branch'],
        }),
        createBranch: builder.mutation<Branch, CreateBranchRequest>({
            query: (data) => ({
                url: '/administration/branches',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Branch'],
        }),
        updateBranch: builder.mutation<Branch, UpdateBranchRequest>({
            query: ({ id, ...data }) => ({
                url: `/administration/branches/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Branch'],
        }),
        deleteBranch: builder.mutation<void, number>({
            query: (id) => ({
                url: `/administration/branches/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Branch'],
        }),
        // Audit Logs (read-only)
        getAuditLogs: builder.query<AuditLogListResponse, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/audit-logs',
                params,
            }),
            providesTags: ['AuditLog'],
        }),
        // Legal Documents
        getLegalDocuments: builder.query<LegalDocumentListResponse, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/legal-documents',
                params,
            }),
            providesTags: ['Legal'],
        }),
        createLegalDocument: builder.mutation<LegalDocument, CreateLegalDocumentRequest>({
            query: (data) => ({
                url: '/legal-documents',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Legal'],
        }),
        deleteLegalDocument: builder.mutation<void, number>({
            query: (id) => ({
                url: `/legal-documents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Legal'],
        }),
        // System Setup
        getSystemSetup: builder.query<SystemSetup, void>({
            query: () => '/system-setup',
            providesTags: ['Setup'],
        }),
        updateSystemSetup: builder.mutation<SystemSetup, UpdateSystemSetupRequest>({
            query: (data) => ({
                url: '/system-setup',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Setup'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useDuplicateRoleMutation,
    useGetBranchesQuery,
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation,
    useGetAuditLogsQuery,
    useGetLegalDocumentsQuery,
    useCreateLegalDocumentMutation,
    useDeleteLegalDocumentMutation,
    useGetSystemSetupQuery,
    useUpdateSystemSetupMutation,
} = adminApi;
