import { UserList } from '@/features/admin/components/UserList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestion des Utilisateurs - MILELE Admin',
};

export default function AdminUsersPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.USERS_READ}>
            <div className="container mx-auto py-10">
                <UserList />
            </div>
        </RoleGuard>
    );
}
