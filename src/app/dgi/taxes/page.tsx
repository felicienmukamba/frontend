import { TaxList } from '@/features/sales/components/TaxList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Configuration des Taxes - MILELE Accounting',
};

export default function TaxesPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.COMPANY_SETTINGS}>
            <div className="container mx-auto py-10">
                <TaxList />
            </div>
        </RoleGuard>
    );
}
