'use client';

import { AuditLogViewer } from '@/features/admin/components/AuditLogViewer';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function AuditLogsPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.ROLES_READ}>
            <div className="container mx-auto py-10">
                <AuditLogViewer />
            </div>
        </RoleGuard>
    );
}
