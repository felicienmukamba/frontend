import { Metadata } from 'next';
import { CostCenterList } from '@/features/accounting/components/CostCenterList';

export const metadata: Metadata = {
    title: 'Centres de Coûts - MILELE',
};

export default function CostCentersPage() {
    return (
        <div className="container mx-auto py-10">
            <CostCenterList />
        </div>
    );
}
