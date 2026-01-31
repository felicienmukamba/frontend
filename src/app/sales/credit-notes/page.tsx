import { Metadata } from 'next';
import { CreditNoteList } from '@/features/sales/components/CreditNoteList';

export const metadata: Metadata = {
    title: 'Notes de Crédit - MILELE',
};

export default function CreditNotesPage() {
    return (
        <div className="container mx-auto py-10">
            <CreditNoteList />
        </div>
    );
}
