import DashboardLayout from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function DGILayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.COMPANY_SETTINGS}>
            <DashboardLayout>{children}</DashboardLayout>
        </RoleGuard>
    );
}
