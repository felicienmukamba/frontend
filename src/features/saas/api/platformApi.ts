import { api } from '@/services/api';

export interface CompanyStats {
    totalCompanies: number;
    activeCompanies: number;
    pendingCompanies: number;
    totalUsers: number;
}

export interface SaaSCompany {
    id: number;
    companyName: string;
    rccm: string;
    nationalId: string;
    taxId: string;
    headquartersAddress: string;
    phone: string;
    email: string;
    taxRegime: string;
    taxCenter: string;
    isActive: boolean;
    createdAt: string;
    _count?: {
        users: number;
        branches: number;
    }
}

export const platformApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPlatformStats: builder.query<CompanyStats, void>({
            query: () => '/platform/stats',
            providesTags: ['Company'],
        }),
        getCompanies: builder.query<SaaSCompany[], void>({
            query: () => '/platform/companies',
            providesTags: ['Company'],
        }),
        toggleActivation: builder.mutation<SaaSCompany, { id: number; active: boolean }>({
            query: ({ id, active }) => ({
                url: `/platform/companies/${id}/activation`,
                method: 'PATCH',
                body: { active },
            }),
            invalidatesTags: ['Company'],
        }),
        createCompany: builder.mutation<SaaSCompany, Partial<SaaSCompany>>({
            query: (body) => ({
                url: '/platform/companies',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Company'],
        }),
    }),
});

export const {
    useGetPlatformStatsQuery,
    useGetCompaniesQuery,
    useToggleActivationMutation,
    useCreateCompanyMutation,
} = platformApi;
