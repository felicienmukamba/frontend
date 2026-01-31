'use client';

import { BranchList } from '@/features/admin/components/BranchList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';

export default function BranchesPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.BRANCHES_MANAGE}>
            <div className="container mx-auto py-10">
                <BranchList />
            </div>
        </RoleGuard>
    );
}
