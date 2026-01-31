import { PaymentList } from '@/features/sales/components/PaymentList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Historique des Paiements - MILELE Accounting',
};

export default function PaymentsPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.INVOICES_READ}>
            <div className="container mx-auto py-10">
                <PaymentList />
            </div>
        </RoleGuard>
    );
}
