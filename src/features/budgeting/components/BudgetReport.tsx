'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BudgetExecution } from '../types';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BudgetVsActualChart } from './BudgetVsActualChart';

interface BudgetReportProps {
    data: BudgetExecution;
    currency?: string;
}

export const BudgetReport = ({ data, currency = 'USD' }: BudgetReportProps) => {

    const getVarianceColor = (variance: number, percentage: number) => {
        if (variance < 0) return 'text-red-600';
        if (percentage > 90) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage > 100) return 'bg-red-600';
        if (percentage > 90) return 'bg-yellow-600';
        return 'bg-green-600';
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Budget Total Prévu</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.totalPlanned, currency)}</div>
                        <p className="text-xs text-muted-foreground">
                            Objectif de dépenses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Réalisé (Dépensé)</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.totalActual, currency)}</div>
                        <Progress
                            value={Math.min((data.totalActual / data.totalPlanned) * 100, 100)}
                            className={`h-2 mt-2 ${getProgressColor((data.totalActual / data.totalPlanned) * 100)}`}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {((data.totalActual / data.totalPlanned) * 100).toFixed(1)}% du budget utilisé
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Disponible</CardTitle>
                        {data.variance < 0 ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${data.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(data.variance, currency)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {data.variance < 0 ? 'Dépassement budgétaire' : 'Reste à dépenser'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BudgetVsActualChart data={data.details.map(d => ({
                    name: d.accountLabel,
                    budget: d.planned,
                    actual: d.actual
                }))} />
            </div>

            {/* Detailed Execution Table */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Détails par Ligne Budgétaire</CardTitle>
                    <CardDescription>
                        Suivi détaillé des dépenses par compte comptable.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Compte</TableHead>
                                <TableHead className="text-right">Prévision</TableHead>
                                <TableHead className="text-right">Réalisation</TableHead>
                                <TableHead className="text-right">Écart</TableHead>
                                <TableHead className="text-right">% Utilisé</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.details.map((line) => (
                                <TableRow key={line.accountId}>
                                    <TableCell>
                                        <div className="font-medium">{line.accountNumber}</div>
                                        <div className="text-xs text-muted-foreground">{line.accountLabel}</div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(line.planned, currency)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(line.actual, currency)}
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${line.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(line.variance, currency)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-xs font-medium">{line.variancePercentage.toFixed(1)}%</span>
                                            <Progress
                                                value={Math.min(line.variancePercentage, 100)}
                                                className="w-16 h-2"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {line.variancePercentage > 100 ? (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Dépassement</span>
                                        ) : line.variancePercentage > 85 ? (
                                            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Attention</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">OK</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.details.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Aucune ligne budgétaire définie.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
