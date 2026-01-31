'use client';

import {
    useGetCompaniesQuery,
    useToggleActivationMutation
} from '@/features/saas/api/platformApi';
import { CompanyTable } from '@/features/saas/components/CompanyTable';
import { CompanyManagementDialog } from '@/features/saas/components/CompanyManagementDialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function SaaSCompanies() {
    const { data: companies, isLoading, error } = useGetCompaniesQuery();
    const [toggleActivation] = useToggleActivationMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleToggle = async (id: number, currentStatus: boolean) => {
        try {
            await toggleActivation({ id, active: !currentStatus }).unwrap();
            toast.success(currentStatus
                ? 'Accès entreprise suspendu temporairement.'
                : 'Entreprise activée avec succès !'
            );
        } catch (error) {
            toast.error('Échec de la modification du statut.');
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-outfit mb-2">Gestion des Entreprises</h2>
                    <p className="text-slate-500 font-medium max-w-xl">
                        Liste de tous les tenanciers enregistrés sur la plateforme. Activez ou suspendez les accès ici.
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-drc-blue text-white hover:bg-blue-700 rounded-xl h-12 px-6 font-bold shadow-xl shadow-blue-100 border-0 flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Nouvel Enregistrement
                    </Button>
                </div>
            </div>

            <CompanyTable
                companies={companies}
                isLoading={isLoading}
                error={error}
                onToggleActivation={handleToggle}
            />

            <CompanyManagementDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
