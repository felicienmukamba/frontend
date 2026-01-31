'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-provider';
import { UserRole } from '../types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole | UserRole[];
    requiredPermission?: string;
}

export function RoleGuard({ children, allowedRoles, requiredPermission }: RoleGuardProps) {
    const { isAuthenticated, hasRole, hasPermission, isSuperAdmin } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login');
            return;
        }

        const hasRoleAccess = allowedRoles ? hasRole(allowedRoles) : true;
        const hasPermissionAccess = requiredPermission ? hasPermission(requiredPermission) : true;

        if (mounted && !isSuperAdmin && (!hasRoleAccess || !hasPermissionAccess)) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, hasRole, hasPermission, allowedRoles, requiredPermission, router, isSuperAdmin, mounted]);

    if (!mounted || !isAuthenticated) {
        return null;
    }

    const hasRoleAccess = allowedRoles ? hasRole(allowedRoles) : true;
    const hasPermissionAccess = requiredPermission ? hasPermission(requiredPermission) : true;

    if (!isSuperAdmin && (!hasRoleAccess || !hasPermissionAccess)) {
        return null;
    }

    return <>{children}</>;
}
