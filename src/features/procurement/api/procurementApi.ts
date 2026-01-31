import { api } from '@/services/api';
import {
    PurchaseOrder,
    StockReception,
    CreatePurchaseOrderRequest,
    CreateStockReceptionRequest
} from '../types';

export const procurementApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Purchase Orders
        getPurchaseOrders: builder.query<PurchaseOrder[], { status?: string; supplierId?: number } | void>({
            query: (params) => ({ url: '/purchase-orders', params: params || {} }),
            providesTags: ['PurchaseOrder'],
        }),
        getPurchaseOrder: builder.query<PurchaseOrder, string>({
            query: (id) => `/purchase-orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'PurchaseOrder', id }],
        }),
        createPurchaseOrder: builder.mutation<PurchaseOrder, CreatePurchaseOrderRequest>({
            query: (data) => ({
                url: '/purchase-orders',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['PurchaseOrder'],
        }),
        updatePurchaseOrder: builder.mutation<PurchaseOrder, { id: string; data: Partial<CreatePurchaseOrderRequest> }>({
            query: ({ id, data }) => ({
                url: `/purchase-orders/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['PurchaseOrder', { type: 'PurchaseOrder', id }],
        }),
        cancelPurchaseOrder: builder.mutation<PurchaseOrder, string>({
            query: (id) => ({
                url: `/purchase-orders/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => ['PurchaseOrder', { type: 'PurchaseOrder', id }],
        }),

        // Stock Receptions
        getStockReceptions: builder.query<StockReception[], { supplierId?: number; purchaseOrderId?: string } | void>({
            query: (params) => ({ url: '/stock-receptions', params: params || {} }),
            providesTags: ['StockReception'],
        }),
        getStockReception: builder.query<StockReception, string>({
            query: (id) => `/stock-receptions/${id}`,
            providesTags: (result, error, id) => [{ type: 'StockReception', id }],
        }),
        createStockReception: builder.mutation<StockReception, CreateStockReceptionRequest>({
            query: (data) => ({
                url: '/stock-receptions',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['StockReception', 'PurchaseOrder', 'Product'],
        }),
    }),
});

export const {
    useGetPurchaseOrdersQuery,
    useGetPurchaseOrderQuery,
    useCreatePurchaseOrderMutation,
    useUpdatePurchaseOrderMutation,
    useCancelPurchaseOrderMutation,
    useGetStockReceptionsQuery,
    useGetStockReceptionQuery,
    useCreateStockReceptionMutation,
} = procurementApi;
