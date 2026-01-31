import { Metadata } from 'next';
import { JournalList } from '@/features/accounting/components/JournalList';

export const metadata: Metadata = {
    title: 'Journaux Comptables - MILELE',
};

export default function JournalsPage() {
    return (
        <div className="container mx-auto py-10">
            <JournalList />
        </div>
    );
}
