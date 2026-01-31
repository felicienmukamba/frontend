'use client';

import { useState, useEffect } from 'react';
import { AuthHeader } from './AuthHeader';
import { DashboardSidebar } from './DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by only rendering shell after mount
    if (!isMounted) {
        return <div className="h-screen bg-[#f8fafc]" />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
            {/* Full Height Sidebar */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Navbar */}
                <AuthHeader />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

