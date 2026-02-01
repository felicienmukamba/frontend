// Accounting Module Types

export enum EntryStatus {
    PROVISIONAL = 'PROVISIONAL',
    VALIDATED = 'VALIDATED',
}

export enum AccountType {
    ASSET = 'ASSET',
    LIABILITY = 'LIABILITY',
    EXPENSE = 'EXPENSE',
    REVENUE = 'REVENUE',
}

export interface EntryLine {
    id?: number;
    debit: number;
    credit: number;
    description: string;
    matchingCode?: string;
    matchingDate?: string;
    accountId: number;
    thirdPartyId?: number;
    costCenterId?: number;
    account?: Account;
    thirdParty?: { id: number; name: string };
    costCenter?: { id: number; code: string; designation: string };
}

export interface AccountingEntry {
    id: number;
    referenceNumber: string;
    entryDate: string;
    description: string;
    status: EntryStatus;
    currency: string;
    exchangeRate: number;
    journalId: number;
    journal?: Journal;
    fiscalYearId: number;
    fiscalYear?: FiscalYear;
    invoiceId?: number;
    paymentId?: number;
    createdById: number;
    createdBy?: { id: number; firstName: string; lastName: string };
    companyId: number;
    entryLines: EntryLine[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAccountingEntryDto {
    companyId?: number;
    currency: string;
    exchangeRate: number;
    referenceNumber: string;
    entryDate: string;
    description: string;
    status: EntryStatus;
    journalId: number;
    fiscalYearId: number;
    invoiceId?: number;
    paymentId?: number;
    createdById: number;
    entryLines: Omit<EntryLine, 'id'>[];
}

export interface UpdateAccountingEntryDto extends Partial<CreateAccountingEntryDto> {
    id: number;
}

export interface Account {
    id: number;
    accountNumber: string;
    label: string;
    accountClass: number;
    type: AccountType;
    isReconcilable: boolean;
    isAuxiliary: boolean;
    parentAccountId?: number;
    parent?: Account;
    children?: Account[];
    level: number;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAccountDto {
    companyId?: number;
    accountNumber: string;
    label: string;
    accountClass: number;
    type: AccountType;
    isReconcilable?: boolean;
    isAuxiliary?: boolean;
    parentAccountId?: number;
    level?: number;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {
    id: number;
}

export interface Journal {
    id: number;
    code: string;
    label: string;
    description?: string;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateJournalDto {
    companyId?: number;
    code: string;
    label: string;
    description?: string;
}

export interface UpdateJournalDto extends Partial<CreateJournalDto> {
    id: number;
}

export interface FiscalYear {
    id: number;
    code: string;
    startDate: string;
    endDate: string;
    isClosed: boolean;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateFiscalYearDto {
    companyId?: number;
    code: string;
    startDate: string;
    endDate: string;
}

export interface UpdateFiscalYearDto extends Partial<CreateFiscalYearDto> {
    id: number;
}

export interface CostCenter {
    id: number;
    code: string;
    name: string;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCostCenterDto {
    companyId?: number;
    code: string;
    name: string;
}

export interface UpdateCostCenterDto extends Partial<CreateCostCenterDto> {
    id: number;
}

// Response types
export interface PaginatedResponse<T> {
    data: T[];
    meta?: {
        total: number;
        page: number;
        last_page: number;
        limit: number;
    };
}

export type AccountingEntryListResponse = PaginatedResponse<AccountingEntry> | AccountingEntry[];
export type AccountListResponse = PaginatedResponse<Account> | Account[];
export type JournalListResponse = PaginatedResponse<Journal> | Journal[];
export type FiscalYearListResponse = PaginatedResponse<FiscalYear> | FiscalYear[];
export type CostCenterListResponse = PaginatedResponse<CostCenter> | CostCenter[];
