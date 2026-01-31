// Sales Module Types - Extended with Credit Notes

import { ThirdParty } from '@/features/resources/types';
import { Tax } from './salesTypes';

export interface CreditNote {
    id: number;
    creditNoteNumber: string;
    issuedAt: string;
    type: 'REFUND' | 'CANCELLATION';
    currency: string;
    exchangeRate: number;
    totalAmountExclTax: number;
    totalVAT: number;
    totalAmountInclTax: number;
    status: 'DRAFT' | 'VALIDATED' | 'CANCELED';
    observation?: string;
    invoiceId?: number;
    invoice?: { id: number; invoiceNumber: string };
    clientId: number;
    client?: ThirdParty;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCreditNoteDto {
    companyId: number;
    creditNoteNumber: string;
    issuedAt: string;
    type: 'REFUND' | 'CANCELLATION';
    currency: string;
    exchangeRate: number;
    totalAmountExclTax: number;
    totalVAT: number;
    totalAmountInclTax: number;
    status?: 'DRAFT' | 'VALIDATED' | 'CANCELED';
    observation?: string;
    invoiceId?: number;
    clientId: number;
    createdById: number;
}

export interface UpdateCreditNoteDto extends Partial<CreateCreditNoteDto> {
    id: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta?: {
        total: number;
        page: number;
        last_page: number;
        limit: number;
    };
}

export type CreditNoteListResponse = PaginatedResponse<CreditNote> | CreditNote[];

// Re-export existing types
export * from './salesTypes';
