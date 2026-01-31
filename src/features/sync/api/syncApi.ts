import { api } from '@/services/api';

export interface SyncPayloadDto {
    lastSyncTime: string;
    companyId: number;
    data: SyncDataDto;
}

export interface SyncDataDto {
    invoices?: any[];
    payments?: any[];
    entries?: any[];
    products?: any[];
    thirdParties?: any[];
    // Add other entities as needed
}

export interface SyncResponse {
    data: SyncDataDto;
    lastSyncTime: string;
    conflicts?: Array<{
        entity: string;
        id: string;
        localVersion: any;
        serverVersion: any;
    }>;
}

export const syncApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sync: builder.mutation<SyncResponse, SyncPayloadDto>({
            query: (data) => ({
                url: '/sync',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Invoice', 'Payment', 'AccountingEntry', 'Product', 'ThirdParty'],
        }),
    }),
});

export const {
    useSyncMutation,
} = syncApi;
