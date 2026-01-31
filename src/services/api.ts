import { RootState } from '@/store';
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, updateToken } from '@/features/auth/slices/authSlice';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.auth.token || Cookies.get('accessToken');
        const branchId = state.auth.selectedBranchId || Cookies.get('selectedBranchId');

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        if (branchId) {
            headers.set('X-Branch-Id', String(branchId));
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // try to get a new token
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken || Cookies.get('refreshToken');

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const data = (refreshResult.data as any).data || refreshResult.data;
                // store the new token
                api.dispatch(updateToken({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                }));
                // retry the initial query
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }
    if (result.data) {
        // Automatically unwrap the 'data' field from our standardized response envelope
        // This makes result.data in endpoints contain directly the actual payload
        if (result.data && typeof result.data === 'object' && 'data' in result.data && 'success' in result.data) {
            result.data = (result.data as any).data;
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'User', 'Company', 'Role', 'Branch', 'AuditLog', 'Legal', 'Setup', 'ThirdParty', 'Product', 'Invoice', 'Payment', 'Tax', 'CreditNote', 'Employee', 'PayrollPeriod', 'Payslip', 'AccountingEntry', 'Account', 'Journal', 'FiscalYear', 'CostCenter', 'PurchaseOrder', 'StockReception', 'StockMovement', 'Budget'],
    endpoints: () => ({}),
});
