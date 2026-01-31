import { api } from '@/services/api';
import {
    Budget,
    BudgetListResponse,
    CreateBudgetDto,
    UpdateBudgetDto,
    BudgetLine,
    CreateBudgetLineDto,
    UpdateBudgetLineDto,
    BudgetExecution,
} from '../types';

export const budgetingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Budgets
        getBudgets: builder.query<BudgetListResponse, void>({
            query: () => '/budgeting',
            providesTags: ['Budget'],
        }),
        getBudget: builder.query<Budget, string>({
            query: (id) => `/budgeting/${id}`,
            providesTags: (result, error, id) => [{ type: 'Budget', id }],
        }),
        createBudget: builder.mutation<Budget, CreateBudgetDto>({
            query: (data) => ({
                url: '/budgeting',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Budget'],
        }),
        updateBudget: builder.mutation<Budget, UpdateBudgetDto>({
            query: ({ id, ...data }) => ({
                url: `/budgeting/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Budget', { type: 'Budget', id }],
        }),
        deleteBudget: builder.mutation<void, string>({
            query: (id) => ({
                url: `/budgeting/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Budget'],
        }),

        // Budget Lines
        addBudgetLine: builder.mutation<BudgetLine, CreateBudgetLineDto>({
            query: (data) => ({
                url: '/budgeting/lines',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Budget'],
        }),
        updateBudgetLine: builder.mutation<BudgetLine, UpdateBudgetLineDto>({
            query: ({ id, ...data }) => ({
                url: `/budgeting/lines/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Budget'],
        }),
        deleteBudgetLine: builder.mutation<void, string>({
            query: (id) => ({
                url: `/budgeting/lines/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Budget'],
        }),

        // Budget Execution
        getBudgetExecution: builder.query<BudgetExecution, string>({
            query: (id) => `/budgeting/${id}/execution`,
            providesTags: (result, error, id) => [{ type: 'Budget', id }, 'AccountingEntry'],
        }),
    }),
});

export const {
    useGetBudgetsQuery,
    useGetBudgetQuery,
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
    useDeleteBudgetMutation,
    useAddBudgetLineMutation,
    useUpdateBudgetLineMutation,
    useDeleteBudgetLineMutation,
    useGetBudgetExecutionQuery,
} = budgetingApi;
