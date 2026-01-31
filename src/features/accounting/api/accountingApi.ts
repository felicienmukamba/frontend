import { api } from '@/services/api';
import {
    AccountingEntry,
    AccountingEntryListResponse,
    CreateAccountingEntryDto,
    UpdateAccountingEntryDto,
    Account,
    AccountListResponse,
    CreateAccountDto,
    UpdateAccountDto,
    Journal,
    JournalListResponse,
    CreateJournalDto,
    UpdateJournalDto,
    FiscalYear,
    FiscalYearListResponse,
    CreateFiscalYearDto,
    UpdateFiscalYearDto,
    CostCenter,
    CostCenterListResponse,
    CreateCostCenterDto,
    UpdateCostCenterDto,
} from '../types';

export const accountingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Accounting Entries
        getEntries: builder.query<AccountingEntryListResponse, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/entries',
                params,
            }),
            providesTags: ['AccountingEntry'],
        }),
        getEntry: builder.query<AccountingEntry, number>({
            query: (id) => `/entries/${id}`,
            providesTags: (result, error, id) => [{ type: 'AccountingEntry', id }],
        }),
        createEntry: builder.mutation<AccountingEntry, CreateAccountingEntryDto>({
            query: (data) => ({
                url: '/entries',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['AccountingEntry'],
        }),
        updateEntry: builder.mutation<AccountingEntry, UpdateAccountingEntryDto>({
            query: ({ id, ...data }) => ({
                url: `/entries/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['AccountingEntry', { type: 'AccountingEntry', id }],
        }),
        deleteEntry: builder.mutation<void, number>({
            query: (id) => ({
                url: `/entries/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AccountingEntry'],
        }),
        validateEntry: builder.mutation<AccountingEntry, number>({
            query: (id) => ({
                url: `/entries/${id}/validate`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => ['AccountingEntry', { type: 'AccountingEntry', id }],
        }),
        getTrashedEntries: builder.query<AccountingEntryListResponse, void>({
            query: () => '/entries/trash/list',
            providesTags: ['AccountingEntry'],
        }),
        softDeleteEntry: builder.mutation<void, number>({
            query: (id) => ({
                url: `/entries/${id}/trash`,
                method: 'POST',
            }),
            invalidatesTags: ['AccountingEntry'],
        }),
        restoreEntry: builder.mutation<void, number>({
            query: (id) => ({
                url: `/entries/${id}/restore`,
                method: 'POST',
            }),
            invalidatesTags: ['AccountingEntry'],
        }),
        permanentDeleteEntry: builder.mutation<void, number>({
            query: (id) => ({
                url: `/entries/${id}/purge`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AccountingEntry'],
        }),

        // Accounts
        getAccounts: builder.query<AccountListResponse, void>({
            query: () => '/accounts',
            providesTags: ['Account'],
        }),
        getAccount: builder.query<Account, number>({
            query: (id) => `/accounts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Account', id }],
        }),
        createAccount: builder.mutation<Account, CreateAccountDto>({
            query: (data) => ({
                url: '/accounts',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Account'],
        }),
        updateAccount: builder.mutation<Account, UpdateAccountDto>({
            query: ({ id, ...data }) => ({
                url: `/accounts/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Account', { type: 'Account', id }],
        }),
        deleteAccount: builder.mutation<void, number>({
            query: (id) => ({
                url: `/accounts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Account'],
        }),
        importAccounts: builder.mutation<{ message: string; count: number }, FormData>({
            query: (formData) => ({
                url: '/accounts/import',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Account'],
        }),

        // Journals
        getJournals: builder.query<JournalListResponse, void>({
            query: () => '/journals',
            providesTags: ['Journal'],
        }),
        getJournal: builder.query<Journal, number>({
            query: (id) => `/journals/${id}`,
            providesTags: (result, error, id) => [{ type: 'Journal', id }],
        }),
        createJournal: builder.mutation<Journal, CreateJournalDto>({
            query: (data) => ({
                url: '/journals',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Journal'],
        }),
        updateJournal: builder.mutation<Journal, UpdateJournalDto>({
            query: ({ id, ...data }) => ({
                url: `/journals/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Journal', { type: 'Journal', id }],
        }),
        deleteJournal: builder.mutation<void, number>({
            query: (id) => ({
                url: `/journals/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Journal'],
        }),

        // Fiscal Years
        getFiscalYears: builder.query<FiscalYearListResponse, void>({
            query: () => '/fiscal-years',
            providesTags: ['FiscalYear'],
        }),
        getFiscalYear: builder.query<FiscalYear, number>({
            query: (id) => `/fiscal-years/${id}`,
            providesTags: (result, error, id) => [{ type: 'FiscalYear', id }],
        }),
        createFiscalYear: builder.mutation<FiscalYear, CreateFiscalYearDto>({
            query: (data) => ({
                url: '/fiscal-years',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['FiscalYear'],
        }),
        updateFiscalYear: builder.mutation<FiscalYear, UpdateFiscalYearDto>({
            query: ({ id, ...data }) => ({
                url: `/fiscal-years/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['FiscalYear', { type: 'FiscalYear', id }],
        }),
        deleteFiscalYear: builder.mutation<void, number>({
            query: (id) => ({
                url: `/fiscal-years/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['FiscalYear'],
        }),
        closeFiscalYear: builder.mutation<FiscalYear, number>({
            query: (id) => ({
                url: `/fiscal-years/${id}/close`,
                method: 'POST',
            }),
            invalidatesTags: ['FiscalYear'],
        }),

        // Cost Centers
        getCostCenters: builder.query<CostCenterListResponse, void>({
            query: () => '/cost-centers',
            providesTags: ['CostCenter'],
        }),
        getCostCenter: builder.query<CostCenter, number>({
            query: (id) => `/cost-centers/${id}`,
            providesTags: (result, error, id) => [{ type: 'CostCenter', id }],
        }),
        createCostCenter: builder.mutation<CostCenter, CreateCostCenterDto>({
            query: (data) => ({
                url: '/cost-centers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CostCenter'],
        }),
        updateCostCenter: builder.mutation<CostCenter, UpdateCostCenterDto>({
            query: ({ id, ...data }) => ({
                url: `/cost-centers/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['CostCenter', { type: 'CostCenter', id }],
        }),
        deleteCostCenter: builder.mutation<void, number>({
            query: (id) => ({
                url: `/cost-centers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CostCenter'],
        }),

        // Reports
        getBalanceSheet: builder.query<any, number>({
            query: (fiscalYearId) => `/accounting/reports/balance-sheet/${fiscalYearId}`,
        }),
        getProfitAndLoss: builder.query<any, number>({
            query: (fiscalYearId) => `/accounting/reports/profit-loss/${fiscalYearId}`,
        }),
        getTrialBalance: builder.query<any, number>({
            query: (fiscalYearId) => `/accounting/reports/trial-balance/${fiscalYearId}`,
        }),
        getVATReport: builder.query<any, number>({
            query: (fiscalYearId) => `/accounting/reports/vat/${fiscalYearId}`,
        }),
        getCashFlow: builder.query<any, number>({
            query: (fiscalYearId) => `/accounting/reports/cash-flow/${fiscalYearId}`,
        }),
        getGeneralLedger: builder.query<any, { accountId: number; fiscalYearId: number }>({
            query: ({ accountId, fiscalYearId }) => `/accounting/reports/general-ledger/${accountId}/${fiscalYearId}`,
        }),
        getSixColumnBalance: builder.query<any, number>({
            query: (fiscalYearId) => `/accounting/reports/balance-6-columns/${fiscalYearId}`,
        }),
    }),
});

export const {
    useGetEntriesQuery,
    useGetEntryQuery,
    useCreateEntryMutation,
    useUpdateEntryMutation,
    useDeleteEntryMutation,
    useValidateEntryMutation,
    useGetTrashedEntriesQuery,
    useSoftDeleteEntryMutation,
    useRestoreEntryMutation,
    usePermanentDeleteEntryMutation,
    useGetAccountsQuery,
    useGetAccountQuery,
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useImportAccountsMutation,
    useGetJournalsQuery,
    useGetJournalQuery,
    useCreateJournalMutation,
    useUpdateJournalMutation,
    useDeleteJournalMutation,
    useGetFiscalYearsQuery,
    useGetFiscalYearQuery,
    useCreateFiscalYearMutation,
    useUpdateFiscalYearMutation,
    useDeleteFiscalYearMutation,
    useCloseFiscalYearMutation,
    useGetCostCentersQuery,
    useGetCostCenterQuery,
    useCreateCostCenterMutation,
    useUpdateCostCenterMutation,
    useDeleteCostCenterMutation,
    useGetBalanceSheetQuery,
    useGetProfitAndLossQuery,
    useGetTrialBalanceQuery,
    useGetVATReportQuery,
    useGetCashFlowQuery,
    useGetGeneralLedgerQuery,
    useGetSixColumnBalanceQuery,
} = accountingApi;
