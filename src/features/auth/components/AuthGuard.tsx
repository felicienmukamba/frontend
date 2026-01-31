'use client';

import { useAuth } from '@/features/auth/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router, isMounted]);

    // On server and first client render, return a placeholder matching DashboardLayout base color
    if (!isMounted || isLoading) {
        return (
            <div className="h-screen bg-[#f8fafc] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-drc-blue" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
