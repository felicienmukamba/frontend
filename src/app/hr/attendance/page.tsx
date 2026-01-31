'use client';

import React from 'react';
import { AttendanceList } from '@/features/hr/components/AttendanceList';

export default function AttendancePage() {
    return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Présences & Temps</h1>
                    <p className="text-slate-400">Suivi des heures de travail et de la ponctualité.</p>
                </div>

                <AttendanceList />
            </div>
    );
}
