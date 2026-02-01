'use client';

import { useState } from 'react';
import { Plus, Calendar, Check, X, Trash2, Loader2 } from 'lucide-react';
import { ButtonDRC } from '@/components/ui/button';
import { CardDRC } from '@/components/ui/card';
import { BadgeDRC } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    useGetFiscalYearsQuery,
    useCreateFiscalYearMutation,
    useActivateFiscalYearMutation,
    useDeactivateFiscalYearMutation,
    useDeleteFiscalYearMutation,
} from '../api/fiscalYearsApi';

export function FiscalYearList() {
    const { data: fiscalYears = [], isLoading } = useGetFiscalYearsQuery();
    const [createFiscalYear, { isLoading: isCreating }] = useCreateFiscalYearMutation();
    const [activateFiscalYear] = useActivateFiscalYearMutation();
    const [deactivateFiscalYear] = useDeactivateFiscalYearMutation();
    const [deleteFiscalYear] = useDeleteFiscalYearMutation();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        startDate: '',
        endDate: ''
    });

    const handleCreate = async () => {
        if (!formData.code || !formData.startDate || !formData.endDate) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        try {
            await createFiscalYear(formData).unwrap();
            setIsCreateDialogOpen(false);
            setFormData({ code: '', startDate: '', endDate: '' });
            toast.success(`Exercice "${formData.code}" créé et activé`);
        } catch (error) {
            toast.error('Erreur lors de la création de l\'exercice');
        }
    };

    const handleActivate = async (id: number) => {
        try {
            await activateFiscalYear(id).unwrap();
            toast.success('Exercice activé avec succès');
        } catch (error) {
            toast.error('Erreur lors de l\'activation');
        }
    };

    const handleDeactivate = async (id: number) => {
        try {
            await deactivateFiscalYear(id).unwrap();
            toast.info('Exercice désactivé');
        } catch (error) {
            toast.error('Erreur lors de la désactivation');
        }
    };

    const handleDelete = async (id: number) => {
        const fiscalYear = fiscalYears.find(fy => fy.id === id);
        if (fiscalYear && !fiscalYear.isClosed) {
            toast.error('Impossible de supprimer un exercice actif');
            return;
        }

        try {
            await deleteFiscalYear(id).unwrap();
            toast.success('Exercice supprimé');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const activeFiscalYear = fiscalYears.find(fy => !fy.isClosed);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                            Exercices Fiscaux
                        </h1>
                        <p className="text-slate-600 mt-1">Gestion des périodes comptables</p>
                    </div>
                    <ButtonDRC
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvel Exercice
                    </ButtonDRC>
                </div>

                {/* Active Fiscal Year Card */}
                {activeFiscalYear && (
                    <CardDRC className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm font-medium opacity-90">Exercice Actif</span>
                                </div>
                                <h2 className="text-2xl font-bold">{activeFiscalYear.code}</h2>
                                <p className="text-blue-100">
                                    Du {new Date(activeFiscalYear.startDate).toLocaleDateString('fr-FR')} au{' '}
                                    {new Date(activeFiscalYear.endDate).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <BadgeDRC variant="blue" className="bg-white/20 text-white border-white/30">
                                <Check className="w-3 h-3 mr-1" />
                                Actif
                            </BadgeDRC>
                        </div>
                    </CardDRC>
                )}

                {/* Fiscal Years List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Historique des Exercices</h3>
                    {fiscalYears.length === 0 ? (
                        <CardDRC className="p-12 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-600 mb-4">Aucun exercice fiscal créé</p>
                            <ButtonDRC
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Créer le premier exercice
                            </ButtonDRC>
                        </CardDRC>
                    ) : (
                        <div className="grid gap-4">
                            {fiscalYears.map((fiscalYear) => (
                                <CardDRC
                                    key={fiscalYear.id}
                                    className={`p-6 transition-all duration-200 ${!fiscalYear.isClosed
                                        ? 'border-blue-200 bg-blue-50/50'
                                        : 'hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-lg ${!fiscalYear.isClosed
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-slate-900">{fiscalYear.code}</h4>
                                                    {!fiscalYear.isClosed && (
                                                        <BadgeDRC variant="green">
                                                            <Check className="w-3 h-3 mr-1" />
                                                            Actif
                                                        </BadgeDRC>
                                                    )}
                                                    {fiscalYear.isClosed && (
                                                        <BadgeDRC variant="gray">
                                                            <X className="w-3 h-3 mr-1" />
                                                            Clôturé
                                                        </BadgeDRC>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    Du {new Date(fiscalYear.startDate).toLocaleDateString('fr-FR')} au{' '}
                                                    {new Date(fiscalYear.endDate).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {fiscalYear.isClosed ? (
                                                <ButtonDRC
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleActivate(fiscalYear.id)}
                                                    className="gap-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Activer
                                                </ButtonDRC>
                                            ) : (
                                                <ButtonDRC
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeactivate(fiscalYear.id)}
                                                    className="gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Désactiver
                                                </ButtonDRC>
                                            )}
                                            {fiscalYear.isClosed && (
                                                <ButtonDRC
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(fiscalYear.id)}
                                                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </ButtonDRC>
                                            )}
                                        </div>
                                    </div>
                                </CardDRC>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            Nouvel Exercice Fiscal
                        </DialogTitle>
                        <DialogDescription>
                            Créer un nouvel exercice fiscal pour votre société
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code de l'exercice</Label>
                            <Input
                                id="code"
                                placeholder="Ex: 2026"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Date de début</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Date de fin</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> La création d'un nouvel exercice désactivera automatiquement tous les autres exercices actifs.
                            </p>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                            <ButtonDRC
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                                disabled={isCreating}
                            >
                                Annuler
                            </ButtonDRC>
                            <ButtonDRC
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                Créer l'exercice
                            </ButtonDRC>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
