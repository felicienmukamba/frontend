import DashboardLayout from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.PRODUCTS_READ}>
            <DashboardLayout>{children}</DashboardLayout>
        </RoleGuard>
    );
}
