import { Metadata } from 'next';
import { StockMovementList } from '@/features/resources/components/StockMovementList';

export const metadata: Metadata = {
    title: 'Mouvements de Stock - MILELE',
};

export default function StockMovementsPage() {
    return (
        <div className="container mx-auto py-10">
            <StockMovementList />
        </div>
    );
}
