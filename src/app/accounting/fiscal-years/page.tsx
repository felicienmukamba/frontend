import { Metadata } from 'next';
import { FiscalYearList } from '@/features/accounting/components/FiscalYearList';

export const metadata: Metadata = {
    title: 'Exercices Fiscaux - MILELE',
};

export default function FiscalYearsPage() {
    return (
        <div className="container mx-auto py-10">
            <FiscalYearList />
        </div>
    );
}
