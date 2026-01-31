import { api } from '@/services/api';

export interface DgiTriggerResponse {
    message: string;
    invoiceId: number;
    submittedAt?: string;
}

export const dgiApi = api.injectEndpoints({
    endpoints: (builder) => ({
        triggerDgiSubmission: builder.mutation<DgiTriggerResponse, number>({
            query: (invoiceId) => ({
                url: `/administration/dgi/trigger/${invoiceId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Invoice'],
        }),
    }),
});

export const {
    useTriggerDgiSubmissionMutation,
} = dgiApi;
