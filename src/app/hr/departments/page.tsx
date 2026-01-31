'use client';

import React from 'react';
import { DepartmentList } from '@/features/hr/components/DepartmentList';

export default function DepartmentsPage() {
    return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Départements</h1>
                    <p className="text-slate-400">Gérez la structure hiérarchique et les équipes.</p>
                </div>

                <DepartmentList />
            </div>
    );
}
