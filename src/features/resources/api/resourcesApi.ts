import { api } from '@/services/api';
import {
    ThirdParty, ThirdPartyListResponse, CreateThirdPartyRequest, UpdateThirdPartyRequest,
    Product, ProductListResponse, CreateProductRequest, UpdateProductRequest,
    StockMovement, StockMovementListResponse, CreateStockMovementDto, UpdateStockMovementDto
} from '../types';

export const resourcesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Third Parties
        getThirdParties: builder.query<ThirdPartyListResponse, { page?: number; limit?: number; type?: string; search?: string }>({
            query: (params) => ({
                url: '/third-parties',
                params,
            }),
            providesTags: ['ThirdParty'],
        }),
        getThirdParty: builder.query<ThirdParty, string | number>({
            query: (id) => `/third-parties/${id}`,
            providesTags: (result, error, id) => [{ type: 'ThirdParty', id }],
        }),
        createThirdParty: builder.mutation<ThirdParty, CreateThirdPartyRequest>({
            query: (data) => ({
                url: '/third-parties',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ThirdParty'],
        }),
        updateThirdParty: builder.mutation<ThirdParty, UpdateThirdPartyRequest>({
            query: ({ id, ...data }) => ({
                url: `/third-parties/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['ThirdParty', { type: 'ThirdParty', id }],
        }),
        getThirdPartyHistory: builder.query<any, number>({
            query: (id) => `/third-parties/${id}/history`,
            providesTags: (result, error, id) => [{ type: 'ThirdParty', id: `HISTORY-${id}` }],
        }),
        deleteThirdParty: builder.mutation<void, number>({
            query: (id) => ({
                url: `/third-parties/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ThirdParty'],
        }),

        // Products
        getProducts: builder.query<ProductListResponse, { page?: number; limit?: number; search?: string; type?: string }>({
            query: (params) => ({
                url: '/products',
                params,
            }),
            providesTags: ['Product'],
        }),
        getProduct: builder.query<Product, string | number>({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
        createProduct: builder.mutation<Product, CreateProductRequest>({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<Product, UpdateProductRequest>({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Product', { type: 'Product', id }],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),

        // Stock Movements
        getStockMovements: builder.query<StockMovementListResponse, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/stock-movements',
                params,
            }),
            providesTags: ['StockMovement'],
        }),
        getStockMovement: builder.query<StockMovement, number>({
            query: (id) => `/stock-movements/${id}`,
            providesTags: (result, error, id) => [{ type: 'StockMovement', id }],
        }),
        createStockMovement: builder.mutation<StockMovement, CreateStockMovementDto>({
            query: (data) => ({
                url: '/stock-movements',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['StockMovement', 'Product'],
        }),
        updateStockMovement: builder.mutation<StockMovement, UpdateStockMovementDto>({
            query: ({ id, ...data }) => ({
                url: `/stock-movements/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['StockMovement', { type: 'StockMovement', id }, 'Product'],
        }),
        deleteStockMovement: builder.mutation<void, number>({
            query: (id) => ({
                url: `/stock-movements/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['StockMovement', 'Product'],
        }),

        // Third Parties Trash
        getTrashedThirdParties: builder.query<ThirdPartyListResponse, void>({
            query: () => '/third-parties/trash/list',
            providesTags: ['ThirdParty'],
        }),
        softDeleteThirdParty: builder.mutation<void, number>({
            query: (id) => ({
                url: `/third-parties/${id}/trash`,
                method: 'POST',
            }),
            invalidatesTags: ['ThirdParty'],
        }),
        restoreThirdParty: builder.mutation<void, number>({
            query: (id) => ({
                url: `/third-parties/${id}/restore`,
                method: 'POST',
            }),
            invalidatesTags: ['ThirdParty'],
        }),
        permanentDeleteThirdParty: builder.mutation<void, number>({
            query: (id) => ({
                url: `/third-parties/${id}/purge`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ThirdParty'],
        }),

        // Products Trash
        getTrashedProducts: builder.query<ProductListResponse, void>({
            query: () => '/products/trash/list',
            providesTags: ['Product'],
        }),
        softDeleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}/trash`,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        restoreProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}/restore`,
                method: 'POST',
            }),
            invalidatesTags: ['Product'],
        }),
        permanentDeleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}/purge`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetThirdPartiesQuery,
    useGetThirdPartyQuery,
    useCreateThirdPartyMutation,
    useUpdateThirdPartyMutation,
    useDeleteThirdPartyMutation,
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetStockMovementsQuery,
    useGetStockMovementQuery,
    useCreateStockMovementMutation,
    useUpdateStockMovementMutation,
    useDeleteStockMovementMutation,
    useGetTrashedThirdPartiesQuery,
    useSoftDeleteThirdPartyMutation,
    useRestoreThirdPartyMutation,
    usePermanentDeleteThirdPartyMutation,
    useGetTrashedProductsQuery,
    useSoftDeleteProductMutation,
    useRestoreProductMutation,
    usePermanentDeleteProductMutation,
    useGetThirdPartyHistoryQuery,
} = resourcesApi;
