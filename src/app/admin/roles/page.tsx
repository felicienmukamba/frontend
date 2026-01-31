'use client';

import { RoleList } from '@/features/admin/components/RoleList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function RolesPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.ROLES_READ}>
            <div className="container mx-auto py-10">
                <RoleList />
            </div>
        </RoleGuard>
    );
}
