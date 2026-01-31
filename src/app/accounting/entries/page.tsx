import { EntryList } from '@/features/accounting/components/EntryList';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Écritures Comptables - MILELE',
};

export default function AccountingEntriesPage() {
    return (
        <div className="container mx-auto py-10">
            <EntryList />
        </div>
    );
}
