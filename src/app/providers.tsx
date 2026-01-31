'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/features/auth/lib/auth-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <TooltipProvider delayDuration={0}>
                    {children}
                </TooltipProvider>
            </AuthProvider>
        </Provider>
    );
}
