'use client';

import React, { useEffect, useState } from 'react';

interface PDFWrapperProps {
    children: React.ReactNode;
}

/**
 * SSR-safe wrapper for @react-pdf/renderer components.
 * Prevents "window is not defined" errors during Next.js hydration.
 */
export const PDFWrapper = ({ children }: PDFWrapperProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="p-4 text-muted-foreground animate-pulse">Chargement du visualiseur PDF...</div>;
    }

    return <>{children}</>;
};
