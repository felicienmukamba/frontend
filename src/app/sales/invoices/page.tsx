import { InvoiceList } from '@/features/sales/components/InvoiceList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestion des Factures - MILELE Accounting',
};

export default function InvoicesPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.INVOICES_READ}>
            <div className="container mx-auto py-10">
                <InvoiceList />
            </div>
        </RoleGuard>
    );
}
