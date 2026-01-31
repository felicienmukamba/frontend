import { api } from '@/services/api';

export interface InitializeDto {
    adminFirstName: string;
    adminLastName: string;
    adminEmail: string;
    adminPassword: string;
    companyName: string;
    mainBranchName: string;
    mainBranchCode: string;
    taxId: string;
    nationalId: string;
    rccm: string;
    address: string;
    phone: string;
    email: string;
    taxRegime: string;
    taxCenter: string;
}

export interface SystemStatus {
    initialized: boolean;
}

export interface FactureNormaliseeInfo {
    country: string;
    taxSystem: string;
    mandatoryMentions: string[];
    currency: string;
}

export const setupApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // System Setup
        getSystemStatus: builder.query<SystemStatus, void>({
            query: () => '/admin/status',
            providesTags: ['Setup'],
        }),
        initialize: builder.mutation<{ message: string }, InitializeDto>({
            query: (data) => ({
                url: '/admin/initialize',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Setup'],
        }),

        // Legal Info
        getFactureNormaliseeInfo: builder.query<FactureNormaliseeInfo, void>({
            query: () => '/administration/legal/facture-normalisee/info',
            providesTags: ['Legal'],
        }),
    }),
});

export const {
    useGetSystemStatusQuery,
    useInitializeMutation,
    useGetFactureNormaliseeInfoQuery,
} = setupApi;
