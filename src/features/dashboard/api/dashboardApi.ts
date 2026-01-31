import { api } from '@/services/api';
import { DashboardStats, FiscalYear } from '../types';

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, { fiscalYearId: number; companyId: number }>({
            query: ({ fiscalYearId, companyId }) => ({
                url: '/accounting/reports/dashboard/stats',
                params: { fiscalYearId, companyId },
            }),
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
} = dashboardApi;
