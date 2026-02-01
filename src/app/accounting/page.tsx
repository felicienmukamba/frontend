'use client';

import React from 'react';
import { AccountingDashboard } from '@/features/accounting/components/AccountingDashboard';

export default function AccountingPage() {
    return (
        <div className="container mx-auto py-10 px-6 max-w-[1600px]">
            <AccountingDashboard />
        </div>
    );
}
