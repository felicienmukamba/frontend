import { api } from '@/services/api';

export interface FiscalYear {
    id: number;
    code: string;
    startDate: string;
    endDate: string;
    isClosed: boolean;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFiscalYearDto {
    code: string;
    startDate: string;
    endDate: string;
}

export interface UpdateFiscalYearDto {
    code?: string;
    startDate?: string;
    endDate?: string;
}

export const fiscalYearsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFiscalYears: builder.query<FiscalYear[], void>({
            query: () => '/fiscal-years',
            providesTags: ['FiscalYear'],
        }),
        getActiveFiscalYear: builder.query<FiscalYear, void>({
            query: () => '/fiscal-years/active',
            providesTags: ['FiscalYear'],
        }),
        getFiscalYear: builder.query<FiscalYear, number>({
            query: (id) => `/fiscal-years/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'FiscalYear', id }],
        }),
        createFiscalYear: builder.mutation<FiscalYear, CreateFiscalYearDto>({
            query: (body) => ({
                url: '/fiscal-years',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['FiscalYear'],
        }),
        updateFiscalYear: builder.mutation<FiscalYear, { id: number; data: UpdateFiscalYearDto }>({
            query: ({ id, data }) => ({
                url: `/fiscal-years/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'FiscalYear', id },
                'FiscalYear',
            ],
        }),
        activateFiscalYear: builder.mutation<FiscalYear, number>({
            query: (id) => ({
                url: `/fiscal-years/${id}/activate`,
                method: 'PATCH',
            }),
            invalidatesTags: ['FiscalYear'],
        }),
        deactivateFiscalYear: builder.mutation<FiscalYear, number>({
            query: (id) => ({
                url: `/fiscal-years/${id}/deactivate`,
                method: 'PATCH',
            }),
            invalidatesTags: ['FiscalYear'],
        }),
        deleteFiscalYear: builder.mutation<void, number>({
            query: (id) => ({
                url: `/fiscal-years/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['FiscalYear'],
        }),
    }),
});

export const {
    useGetFiscalYearsQuery,
    useGetActiveFiscalYearQuery,
    useGetFiscalYearQuery,
    useCreateFiscalYearMutation,
    useUpdateFiscalYearMutation,
    useActivateFiscalYearMutation,
    useDeactivateFiscalYearMutation,
    useDeleteFiscalYearMutation,
} = fiscalYearsApi;
