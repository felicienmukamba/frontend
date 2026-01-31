import { Metadata } from 'next';
import { BudgetList } from '@/features/budgeting/components/BudgetList';

export const metadata: Metadata = {
    title: 'Budgets - MILELE',
};

export default function BudgetingPage() {
    return (
        <div className="container mx-auto py-10">
            <BudgetList />
        </div>
    );
}
