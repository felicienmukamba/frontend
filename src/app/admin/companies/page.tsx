import { CompanyList } from '@/features/admin/components/CompanyList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestion des Entreprises - MILELE Admin',
};

export default function AdminCompaniesPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.COMPANY_SETTINGS}>
            <div className="container mx-auto py-10">
                <CompanyList />
            </div>
        </RoleGuard>
    );
}
