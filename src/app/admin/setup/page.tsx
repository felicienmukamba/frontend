import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { SystemSetup } from '@/features/admin/components/SystemSetup';

export default function SetupPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.COMPANY_SETTINGS}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configuration Système</h1>
                    <p className="text-muted-foreground">Paramètres globaux de l'application</p>
                </div>
                <SystemSetup />
            </div>
        </RoleGuard>
    );
}
