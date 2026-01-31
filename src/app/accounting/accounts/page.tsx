import { AccountList } from '@/features/accounting/components/AccountList';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plan Comptable - MILELE',
};

export default function AccountingAccountsPage() {
    return (
        <div className="container mx-auto py-10">
            <AccountList />
        </div>
    );
}
