'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../slices/authSlice';
import { User, UserRole } from '../types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    companyId: number | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    hasPermission: (permission: string) => boolean;
    isSuperAdmin: boolean;
    isSaaSAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        router.push('/login');
    }, [dispatch, router]);

    const hasRole = useCallback(
        (requiredRoles: UserRole | UserRole[]) => {
            if (!user) return false;

            const userRoles = user.roles?.map(r => r.code) || [];

            // Superadmin bypass
            if (userRoles.includes('SUPERADMIN') || user.isSaaSAdmin) return true;

            // Check if user has ANY of the required roles
            const reqRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            return reqRoles.some(req => userRoles.includes(req as string));
        },
        [user]
    );

    const hasPermission = useCallback(
        (permission: string) => {
            if (!user?.roles || user.roles.length === 0) return false;

            const userRoles = user.roles.map(r => r.code);
            if (userRoles.includes('SUPERADMIN') || user.isSaaSAdmin) return true;

            // Check across all roles
            return user.roles.some(role => {
                let permissions = role.permissions;
                if (!permissions) return false;

                // Handle both array and JSON string
                if (typeof permissions === 'string') {
                    try {
                        permissions = JSON.parse(permissions);
                    } catch (e) {
                        // ignore
                    }
                }

                if (Array.isArray(permissions)) {
                    return permissions.includes('*') || permissions.includes(permission);
                }

                return false;
            });
        },
        [user]
    );

    const isSuperAdmin = user?.roles?.some(r => r.code === 'SUPERADMIN') || !!user?.isSaaSAdmin;
    const companyId = user?.companyId || (user as any)?.company?.id || null;

    const value = {
        user,
        companyId,
        isAuthenticated,
        isLoading: false,
        logout: handleLogout,
        hasRole,
        hasPermission,
        isSuperAdmin,
        isSaaSAdmin: !!user?.isSaaSAdmin,
    };

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
