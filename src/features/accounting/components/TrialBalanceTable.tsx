'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetTrialBalanceQuery } from '../api/accountingApi';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TrialBalanceTableProps {
    fiscalYearId: number;
}

export function TrialBalanceTable({ fiscalYearId }: TrialBalanceTableProps) {
    const { data, isLoading, error } = useGetTrialBalanceQuery(fiscalYearId, {
        skip: !fiscalYearId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Calcul de la balance en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center">
                Une erreur est survenue lors de la génération de la balance.
            </div>
        );
    }

    const items = data?.data || [];

    if (items.length === 0) {
        return (
            <div className="py-20 bg-muted/30 rounded-lg border border-dashed text-center">
                <p className="text-muted-foreground">Aucune donnée pour cet exercice.</p>
            </div>
        );
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">N° Compte</TableHead>
                        <TableHead>Intitulé</TableHead>
                        <TableHead className="text-right">Débit</TableHead>
                        <TableHead className="text-right">Crédit</TableHead>
                        <TableHead className="text-right">Solde Débiteur</TableHead>
                        <TableHead className="text-right">Solde Créditeur</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item: any) => (
                        <TableRow key={item.accountNumber}>
                            <TableCell className="font-medium">{item.accountNumber}</TableCell>
                            <TableCell>{item.label}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.totalDebit)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.totalCredit)}</TableCell>
                            <TableCell className="text-right text-indigo-600 font-medium">
                                {item.balance > 0 ? formatCurrency(item.balance) : '-'}
                            </TableCell>
                            <TableCell className="text-right text-rose-600 font-medium">
                                {item.balance < 0 ? formatCurrency(Math.abs(item.balance)) : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="bg-muted/50 font-bold">
                    <TableRow>
                        <TableCell colSpan={2}>TOTAUX</TableCell>
                        <TableCell className="text-right text-indigo-600">
                            {formatCurrency(items.reduce((sum: number, i: any) => sum + (Number(i.totalDebit) || 0), 0))}
                        </TableCell>
                        <TableCell className="text-right text-rose-600">
                            {formatCurrency(items.reduce((sum: number, i: any) => sum + (Number(i.totalCredit) || 0), 0))}
                        </TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
