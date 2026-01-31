import { AuthGuard } from '@/features/auth/components/AuthGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
    );
}
