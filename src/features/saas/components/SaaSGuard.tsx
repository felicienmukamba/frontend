'use client';

import { useAuth } from '@/features/auth/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SaaSGuardProps {
    children: React.ReactNode;
}

export function SaaSGuard({ children }: SaaSGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            } else if (!user?.isSaaSAdmin) {
                router.replace('/dashboard');
            }
        }
    }, [user, isAuthenticated, isLoading, router, mounted]);

    if (!mounted || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
            </div>
        );
    }

    if (!isAuthenticated || !user?.isSaaSAdmin) {
        return null;
    }

    return <>{children}</>;
}
