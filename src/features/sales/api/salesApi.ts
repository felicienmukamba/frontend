import { api } from '@/services/api';
import {
    Invoice, InvoiceListResponse, CreateInvoiceRequest,
    Payment, PaymentListResponse, CreatePaymentRequest,
    Tax, TaxListResponse, CreateTaxRequest,
    CreditNote, CreditNoteListResponse, CreateCreditNoteDto, UpdateCreditNoteDto
} from '../types';

export const salesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Invoices
        getInvoices: builder.query<InvoiceListResponse, { page?: number; limit?: number; status?: string; search?: string }>({
            query: (params) => ({
                url: '/invoices',
                params,
            }),
            providesTags: ['Invoice'],
        }),
        getInvoice: builder.query<Invoice, string>({
            query: (id) => `/invoices/${id}`,
            providesTags: (result, error, id) => [{ type: 'Invoice', id }],
        }),
        createInvoice: builder.mutation<Invoice, CreateInvoiceRequest>({
            query: (data) => ({
                url: '/invoices',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Invoice'],
        }),
        updateInvoice: builder.mutation<Invoice, { id: string; data: Partial<CreateInvoiceRequest> }>({
            query: ({ id, data }) => ({
                url: `/invoices/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Invoice', { type: 'Invoice', id }],
        }),
        validateInvoice: builder.mutation<Invoice, string>({
            query: (id) => ({
                url: `/invoices/${id}/validate`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => ['Invoice', { type: 'Invoice', id }],
        }),
        deleteInvoice: builder.mutation<void, string>({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Invoice'],
        }),

        // Payments
        getPayments: builder.query<PaymentListResponse, { page?: number; limit?: number; invoiceId?: string; search?: string }>({
            query: (params) => ({
                url: '/payments',
                params,
            }),
            providesTags: ['Payment'],
        }),
        createPayment: builder.mutation<Payment, CreatePaymentRequest>({
            query: (data) => ({
                url: '/payments',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Payment', 'Invoice'],
        }),

        // Taxes
        getTaxes: builder.query<TaxListResponse, void>({
            query: () => '/taxes',
            providesTags: ['Tax'],
        }),
        createTax: builder.mutation<Tax, CreateTaxRequest>({
            query: (data) => ({
                url: '/taxes',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Tax'],
        }),
        updateTax: builder.mutation<Tax, { id: number; data: Partial<CreateTaxRequest> }>({
            query: ({ id, data }) => ({
                url: `/taxes/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Tax', { type: 'Tax', id }],
        }),
        deleteTax: builder.mutation<void, number>({
            query: (id) => ({
                url: `/taxes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tax'],
        }),
        getTax: builder.query<Tax, number>({
            query: (id) => `/taxes/${id}`,
            providesTags: (result, error, id) => [{ type: 'Tax', id }],
        }),

        // Credit Notes
        getCreditNotes: builder.query<CreditNoteListResponse, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/credit-notes',
                params,
            }),
            providesTags: ['CreditNote'],
        }),
        getCreditNote: builder.query<CreditNote, number>({
            query: (id) => `/credit-notes/${id}`,
            providesTags: (result, error, id) => [{ type: 'CreditNote', id }],
        }),
        createCreditNote: builder.mutation<CreditNote, CreateCreditNoteDto>({
            query: (data) => ({
                url: '/credit-notes',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CreditNote', 'Invoice'],
        }),
        updateCreditNote: builder.mutation<CreditNote, UpdateCreditNoteDto>({
            query: ({ id, ...data }) => ({
                url: `/credit-notes/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['CreditNote', { type: 'CreditNote', id }],
        }),
        deleteCreditNote: builder.mutation<void, number>({
            query: (id) => ({
                url: `/credit-notes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CreditNote'],
        }),

        // Invoice Payments
        recordInvoicePayment: builder.mutation<Payment, { invoiceId: number; amount: number; paymentMethod: string; reference?: string; date?: string }>({
            query: ({ invoiceId, ...data }) => ({
                url: `/invoices/${invoiceId}/payments`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Payment', 'Invoice'],
        }),
        generateInvoicePDF: builder.query<Blob, number>({
            query: (id) => ({
                url: `/invoices/${id}/pdf`,
                responseHandler: (response) => response.blob(),
            }),
        }),
        getTrashedInvoices: builder.query<InvoiceListResponse, void>({
            query: () => '/invoices/trash/list',
            providesTags: ['Invoice'],
        }),
        softDeleteInvoice: builder.mutation<void, number>({
            query: (id) => ({
                url: `/invoices/${id}/trash`,
                method: 'POST',
            }),
            invalidatesTags: ['Invoice'],
        }),
        restoreInvoice: builder.mutation<void, number>({
            query: (id) => ({
                url: `/invoices/${id}/restore`,
                method: 'POST',
            }),
            invalidatesTags: ['Invoice'],
        }),
        permanentDeleteInvoice: builder.mutation<void, number>({
            query: (id) => ({
                url: `/invoices/${id}/purge`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Invoice'],
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useValidateInvoiceMutation,
    useDeleteInvoiceMutation,
    useGetPaymentsQuery,
    useCreatePaymentMutation,
    useGetTaxesQuery,
    useGetTaxQuery,
    useCreateTaxMutation,
    useUpdateTaxMutation,
    useDeleteTaxMutation,
    useGetCreditNotesQuery,
    useGetCreditNoteQuery,
    useCreateCreditNoteMutation,
    useUpdateCreditNoteMutation,
    useDeleteCreditNoteMutation,
    useRecordInvoicePaymentMutation,
    useGenerateInvoicePDFQuery,
    useGetTrashedInvoicesQuery,
    useSoftDeleteInvoiceMutation,
    useRestoreInvoiceMutation,
    usePermanentDeleteInvoiceMutation,
} = salesApi;
