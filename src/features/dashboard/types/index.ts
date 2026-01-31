export interface DashboardStats {
    revenue: number;
    netIncome: number;
    cashOnHand: number;
    vatToPay: number;
    ratios: {
        currentRatio: number;
        netMargin: number;
        debtRatio: number;
    };
    expenseBreakdown: {
        label: string;
        amount: number;
    }[];
    trends: {
        revenue: { label: string; amount: number }[];
        expenses: { label: string; amount: number }[];
    };
    generatedAt: string;
}

export interface FiscalYear {
    id: number;
    code: string;
    startDate: string;
    endDate: string;
    isClosed: boolean;
    companyId: number;
}
