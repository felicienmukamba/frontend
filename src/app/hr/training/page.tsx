'use client';

import React from 'react';
import { TrainingList } from '@/features/hr/components/TrainingList';

export default function TrainingPage() {
    return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Formations & Développement</h1>
                    <p className="text-slate-400">Gérez les compétences et le parcours professionnel.</p>
                </div>

                <TrainingList />
            </div>
    );
}
