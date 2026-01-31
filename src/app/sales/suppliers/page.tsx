import { ThirdPartyList } from '@/features/resources/components/ThirdPartyList';
import { ThirdPartyType } from '@/features/resources/types';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestion des Fournisseurs - MILELE Accounting',
};

export default function SuppliersPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.THIRD_PARTIES_READ}>
            <div className="container mx-auto py-10">
                <ThirdPartyList type={ThirdPartyType.SUPPLIER} />
            </div>
        </RoleGuard>
    );
}
