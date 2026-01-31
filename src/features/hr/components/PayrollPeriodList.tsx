"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Calendar,
    Lock,
    Unlock,
    FileText,
    TrendingUp
} from 'lucide-react';
import { useGetPayrollPeriodsQuery, useGetPayslipsQuery, useProcessPayslipMutation, useCreatePayslipMutation, useGetEmployeesQuery } from '../api/hrApi';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PayrollPeriodDialog } from './PayrollPeriodDialog';

export const PayrollPeriodList = () => {
    const { data: periods = [], isLoading } = useGetPayrollPeriodsQuery();
    const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
    const { data: payslips = [], isLoading: isPayslipsLoading } = useGetPayslipsQuery(
        { periodId: selectedPeriodId || undefined },
        { skip: !selectedPeriodId }
    );
    const [processPayslip] = useProcessPayslipMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: employees = [] } = useGetEmployeesQuery({});
    const [createPayslip] = useCreatePayslipMutation();

    const handleProcess = async (id: string) => {
        try {
            await processPayslip(id).unwrap();
            toast.success('Bulletin de paie traité et comptabilisé !');
        } catch (err) {
            toast.error('Erreur lors du traitement');
        }
    };

    const handleCreatePeriod = () => {
        setIsDialogOpen(true);
    };

    const handleGenerateAll = async () => {
        if (!selectedPeriodId) return;

        const activeEmployees = employees.filter((e: any) => e.status === 'ACTIVE');
        if (activeEmployees.length === 0) {
            toast.warning('Aucun employé actif trouvé pour générer la paie.');
            return;
        }

        const toastId = toast.loading(`Génération des bulletins pour ${activeEmployees.length} employés...`);
        let generatedCount = 0;

        for (const emp of activeEmployees) {
            try {
                // Check if payslip already exists in local list to avoid duplicates/errors
                // Optimally handled by backend 400 error, which we catch silently
                await createPayslip({
                    employeeId: emp.id,
                    periodId: selectedPeriodId
                }).unwrap();
                generatedCount++;
            } catch (err) {
                // Ignore duplicates or specific errors
            }
        }

        toast.dismiss(toastId);
        if (generatedCount > 0) {
            toast.success(`${generatedCount} bulletins générés avec succès !`);
        } else {
            toast.info('Aucun nouveau bulletin n’a été généré (tous existent déjà ?).');
        }
    };

    if (isLoading) return <Skeleton className="h-20 w-full" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Gestion de la Paie</h2>
                    <p className="text-muted-foreground">Gérez vos périodes de paie et générez les bulletins.</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleCreatePeriod}>
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Période
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {periods.map((period: any) => (
                    <Card
                        key={period.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedPeriodId === period.id ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedPeriodId(period.id)}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center justify-between">
                                {period.name}
                                {period.status === 'CLOSED' ? <Lock className="h-4 w-4 text-slate-400" /> : <Unlock className="h-4 w-4 text-green-500" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{period.code}</p>
                            <Badge className="mt-2" variant={period.status === 'OPEN' ? 'default' : 'secondary'}>
                                {period.status === 'OPEN' ? 'Ouverte' : 'Clôturée'}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedPeriodId && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Bulletins de Paie - {periods.find((p: any) => p.id === selectedPeriodId)?.name}</h3>
                        <Button
                            variant="outline"
                            className="text-purple-600 border-purple-200"
                            onClick={handleGenerateAll}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Générer pour tous
                        </Button>
                    </div>

                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employé</TableHead>
                                    <TableHead>Salaire Brut</TableHead>
                                    <TableHead>Salaire Net</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isPayslipsLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center"><Skeleton className="h-20 w-full" /></TableCell></TableRow>
                                ) : payslips.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10">Aucun bulletin pour cette période</TableCell></TableRow>
                                ) : (
                                    payslips.map((slip) => (
                                        <TableRow key={slip.id}>
                                            <TableCell className="font-medium">
                                                {slip.employee ? `${slip.employee.firstName} ${slip.employee.lastName}` : 'N/A'}
                                            </TableCell>
                                            <TableCell>{(slip.grossSalary || 0).toLocaleString()} USD</TableCell>
                                            <TableCell className="font-bold text-green-600">{(slip.netSalary || 0).toLocaleString()} USD</TableCell>
                                            <TableCell>
                                                <Badge variant={slip.status === 'VALIDATED' ? 'default' : 'outline'}>
                                                    {slip.status === 'VALIDATED' ? 'Validé & Comptabilisé' : 'Brouillon'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                    {slip.status === 'DRAFT' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleProcess(slip.id)}
                                                        >
                                                            Traiter
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
            <PayrollPeriodDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
};
