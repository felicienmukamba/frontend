'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SaaSIndex() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/saas/dashboard');
    }, [router]);

    return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
        </div>
    );
}
