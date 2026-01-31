// Sales Module Core Types

import { ThirdParty } from '@/features/resources/types';
import { Product } from '@/features/resources/types';

export interface InvoiceLine {
    id?: number;
    quantity: number;
    unitPrice: number;
    discountRate?: number;
    discountAmount?: number;
    netAmountExclTax: number;
    vatAmount: number;
    totalAmountInclTax: number;
    description: string;
    productId: number;
    product?: Product;
    taxId: number;
    tax?: Tax;
}

export const InvoiceType = {
    NORMAL: 'NORMAL',
    CREDIT_NOTE: 'CREDIT_NOTE',
}

export type InvoiceType = typeof InvoiceType[keyof typeof InvoiceType];

export const PaymentMethod = {
    CASH: 'CASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CHECK: 'CHECK',
    MOBILE_MONEY: 'MOBILE_MONEY',
}

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];


export const InvoiceStatus = {
    DRAFT: 'DRAFT',
    VALIDATED: 'VALIDATED',
    SIGNED: 'SIGNED',
    CANCELED: 'CANCELED',
}

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export interface Invoice {
    id: number;
    invoiceNumber: string;
    internalReference?: string;
    issuedAt: string;
    type: InvoiceType;
    currency: string;
    exchangeRate: number;
    totalAmountExclTax: number;
    totalVAT: number;
    totalAmountInclTax: number;
    status: InvoiceStatus;
    observation?: string;
    deviceId?: string;
    clientId: number;
    client?: ThirdParty;
    invoiceLines: InvoiceLine[];
    payments?: Payment[];
    companyId: number;
    createdById: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateInvoiceRequest {
    companyId: number;
    invoiceNumber: string;
    internalReference?: string;
    issuedAt: string;
    type: InvoiceType;
    currency: string;
    exchangeRate: number;
    totalAmountExclTax: number;
    totalVAT: number;
    totalAmountInclTax: number;
    status?: InvoiceStatus;
    observation?: string;
    deviceId?: string;
    clientId: number;
    invoiceLines: Omit<InvoiceLine, 'id'>[];
    createdById: number;
}

export interface Payment {
    id: number;
    amount: number;
    paymentMethod: PaymentMethod;
    reference?: string;
    date: string;
    invoiceId?: number;
    invoice?: Invoice;
    clientId?: number;
    client?: ThirdParty;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePaymentRequest {
    companyId: number;
    amountPaid: number;
    method: PaymentMethod;
    externalReference?: string;
    paidAt: string;
    invoiceId: number | string;
    clientId?: number;
    observation?: string;
}

export interface Tax {
    id: number;
    code: string;
    label: string;
    rate: number;
    isActive: boolean;
    isDeductible?: boolean;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTaxRequest {
    companyId: number;
    code: string;
    label: string;
    rate: number;
    isActive?: boolean;
    isDeductible?: boolean;
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

export type InvoiceListResponse = PaginatedResponse<Invoice> | Invoice[];
export type PaymentListResponse = PaginatedResponse<Payment> | Payment[];
export type TaxListResponse = PaginatedResponse<Tax> | Tax[];
