import DashboardLayout from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function SalesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.INVOICES_READ}>
            <DashboardLayout>{children}</DashboardLayout>
        </RoleGuard>
    );
}

