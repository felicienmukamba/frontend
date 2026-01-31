'use client';

import React from 'react';
import { LeaveList } from '@/features/hr/components/LeaveList';

export default function LeavesPage() {
    return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestion des Congés</h1>
                    <p className="text-slate-400">Suivi et approbation des demandes d'absence.</p>
                </div>

                <LeaveList />
            </div>
    );
}
