import DashboardLayout from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function AccountingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.ACCOUNTS_READ}>
            <DashboardLayout>{children}</DashboardLayout>
        </RoleGuard>
    );
}

