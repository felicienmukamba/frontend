'use client';

import { useState } from 'react';
import { Plus, Calendar, DollarSign, Users, TrendingUp, Loader2, Lock, CheckCircle2, FileText } from 'lucide-react';
import { ButtonDRC } from '@/components/ui/button';
import { CardDRC } from '@/components/ui/card';
import { BadgeDRC } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PremiumTable, PremiumTableBody, PremiumTableCell, PremiumTableHead, PremiumTableHeader, PremiumTableRow } from '@/components/ui/PremiumTable';
import { PayrollPeriodDialog } from './PayrollPeriodDialog';
import { useGetActiveFiscalYearQuery } from '@/features/accounting/api/fiscalYearsApi';
import { useGetPayrollPeriodsQuery, useCreatePayrollPeriodMutation } from '../api/hrApi';
import { PayrollPeriod } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function PayrollPeriodList() {
    const { data: activeFiscalYear, isLoading: fiscalYearLoading } = useGetActiveFiscalYearQuery();
    const { data: periods = [], isLoading: periodsLoading } = useGetPayrollPeriodsQuery();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPeriods = periods.filter(period =>
        period.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <BadgeDRC variant="blue"><CheckCircle2 className="w-3 h-3 mr-1" />Ouvert</BadgeDRC>;
            case 'CLOSED':
                return <BadgeDRC variant="green"><Lock className="w-3 h-3 mr-1" />Clôturé</BadgeDRC>;
            default:
                return <BadgeDRC variant="gray">{status}</BadgeDRC>;
        }
    };

    const stats = {
        totalPeriods: periods.length,
        activePeriod: periods.find(p => p.status === 'OPEN'),
        totalPaid: periods.reduce((sum, p) => sum + (p.payslips?.reduce((acc, slip) => acc + slip.netSalary, 0) || 0), 0)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Fiscal Year Info */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                            Périodes de Paie
                        </h1>
                        {fiscalYearLoading ? (
                            <div className="flex items-center gap-2 text-slate-500 mt-1">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Chargement de l'exercice...</span>
                            </div>
                        ) : activeFiscalYear ? (
                            <p className="text-slate-600 mt-1">
                                Exercice fiscal: <strong>{activeFiscalYear.code}</strong> ({format(new Date(activeFiscalYear.startDate), 'dd MMM yyyy', { locale: fr })} - {format(new Date(activeFiscalYear.endDate), 'dd MMM yyyy', { locale: fr })})
                            </p>
                        ) : (
                            <p className="text-amber-600 mt-1">⚠️ Aucun exercice fiscal actif</p>
                        )}
                    </div>
                    <ButtonDRC
                        onClick={() => setIsDialogOpen(true)}
                        className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={!activeFiscalYear}
                    >
                        <Plus className="w-4 h-4" />
                        Nouvelle Période
                    </ButtonDRC>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CardDRC className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Périodes</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalPeriods}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardDRC>

                    <CardDRC className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Total Payé</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {stats.totalPaid.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} FC
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardDRC>

                    <CardDRC className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Période Active</p>
                                <p className="text-lg font-semibold text-slate-900">
                                    {stats.activePeriod?.name || 'Aucune'}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardDRC>
                </div>

                {/* Search */}
                <CardDRC className="p-4">
                    <div className="relative">
                        <Input
                            placeholder="Rechercher une période..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </CardDRC>

                {/* Periods Table */}
                <CardDRC>
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow>
                                <PremiumTableHead>Période</PremiumTableHead>
                                <PremiumTableHead>Dates</PremiumTableHead>
                                <PremiumTableHead>Employés</PremiumTableHead>
                                <PremiumTableHead>Total Net</PremiumTableHead>
                                <PremiumTableHead>Statut</PremiumTableHead>
                                <PremiumTableHead>Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {periodsLoading ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                                        <p className="text-slate-500 mt-2">Chargement des données...</p>
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : filteredPeriods.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-12">
                                        <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-600">Aucune période trouvée</p>
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredPeriods.map((period) => {
                                    const periodNet = period.payslips?.reduce((sum, p) => sum + p.netSalary, 0) || 0;
                                    const employeeCount = period.payslips?.length || 0;

                                    return (
                                        <PremiumTableRow key={period.id}>
                                            <PremiumTableCell>
                                                <div className="font-semibold text-slate-900">{period.name}</div>
                                                <div className="text-xs text-slate-400">{period.code}</div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="text-sm text-slate-600">
                                                    {format(new Date(period.startDate), 'dd MMM', { locale: fr })} - {format(new Date(period.endDate), 'dd MMM yyyy', { locale: fr })}
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium">{employeeCount}</span>
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="font-semibold text-green-600">
                                                    {periodNet.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} FC
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                {getStatusBadge(period.status)}
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="flex gap-2">
                                                    <ButtonDRC variant="outline" size="sm">
                                                        Voir
                                                    </ButtonDRC>
                                                    {period.status === 'OPEN' && (
                                                        <ButtonDRC variant="outline" size="sm" className="text-blue-600">
                                                            Gérer
                                                        </ButtonDRC>
                                                    )}
                                                </div>
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    );
                                })
                            )}
                        </PremiumTableBody>
                    </PremiumTable>
                </CardDRC>

                {!activeFiscalYear && !fiscalYearLoading && (
                    <CardDRC className="p-6 bg-amber-50 border-amber-200">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-900 mb-1">Exercice fiscal requis</h3>
                                <p className="text-sm text-amber-700">
                                    Vous devez créer et activer un exercice fiscal avant de pouvoir gérer les périodes de paie.
                                </p>
                            </div>
                        </div>
                    </CardDRC>
                )}
            </div>

            <PayrollPeriodDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={() => {
                    setIsDialogOpen(false);
                    toast.success('Période de paie créée avec succès');
                }}
            />
        </div>
    );
}
