'use client';

import React from 'react';
import { DataImport } from '@/features/import/components/DataImport';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type EntityType = 'employees' | 'accounts' | 'companies' | 'thirdParties' | 'products';

export default function ImportPage() {
    const [selectedEntity, setSelectedEntity] = React.useState<EntityType>('employees');

    return (
        <div className="container mx-auto py-10 px-6 max-w-[1600px]">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
                        Import de Données
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">
                        Importez vos données en masse depuis Excel ou CSV
                    </p>
                </div>

                <div className="w-[280px]">
                    <Select value={selectedEntity} onValueChange={(v) => setSelectedEntity(v as EntityType)}>
                        <SelectTrigger className="font-black">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="employees">Employés</SelectItem>
                            <SelectItem value="accounts">Plan Comptable</SelectItem>
                            <SelectItem value="companies">Entreprises</SelectItem>
                            <SelectItem value="thirdParties">Clients/Fournisseurs</SelectItem>
                            <SelectItem value="products">Produits</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DataImport key={selectedEntity} entityType={selectedEntity} />
        </div>
    );
}
