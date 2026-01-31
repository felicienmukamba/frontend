// Budgeting Module Types

import { Account } from '@/features/accounting/types';
import { FiscalYear } from '@/features/accounting/types';

export interface Budget {
    id: string;
    name: string;
    description?: string;
    fiscalYearId: number;
    fiscalYear?: FiscalYear;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
    lines?: BudgetLine[];
}

export interface BudgetLine {
    id: string;
    budgetId: string;
    accountId: number;
    account?: Account;
    forecastAmount: number;
    actualAmount?: number;
    variance?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBudgetDto {
    name: string;
    description?: string;
    fiscalYearId: number;
}

export interface UpdateBudgetDto extends Partial<CreateBudgetDto> {
    id: string;
}

export interface CreateBudgetLineDto {
    budgetId: string;
    accountId: number;
    forecastAmount: number;
}

export interface UpdateBudgetLineDto {
    id: string;
    forecastAmount: number;
}

export interface BudgetExecution {
    budgetId: string;
    totalPlanned: number;
    totalActual: number;
    variance: number;
    details: BudgetLineExecution[];
}

export interface BudgetLineExecution {
    accountId: number;
    accountNumber: string;
    accountLabel: string;
    planned: number;
    actual: number;
    variance: number;
    variancePercentage: number;
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

export type BudgetListResponse = PaginatedResponse<Budget> | Budget[];
