'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Trash2, BarChart3 } from 'lucide-react';
import {
    useGetBudgetsQuery,
    useDeleteBudgetMutation,
} from '../api/budgetingApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { Budget } from '../types';
import { extractArray } from '@/lib/utils';
import { BudgetDialog } from './BudgetDialog';
import { useRouter } from 'next/navigation';

export const BudgetList = () => {
    const router = useRouter();
    const { data, isLoading, error } = useGetBudgetsQuery();
    const [deleteBudget] = useDeleteBudgetMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

    const budgets = extractArray<Budget>(data);

    const handleCreate = () => {
        setSelectedBudget(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (budget: Budget) => {
        setSelectedBudget(budget);
        setIsDialogOpen(true);
    };

    const handleViewExecution = (budgetId: string) => {
        router.push(`/budgeting/${budgetId}/execution`);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
            try {
                await deleteBudget(id).unwrap();
                toast.success('Budget supprimé');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-28" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Erreur lors du chargement des budgets.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nouveau budget
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Exercice</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {budgets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        Aucun budget trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                budgets.map((budget) => (
                                    <TableRow key={budget.id}>
                                        <TableCell className="font-medium">{budget.name}</TableCell>
                                        <TableCell>{budget.description || '-'}</TableCell>
                                        <TableCell>{budget.fiscalYear?.code || '-'}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(budget)}>
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleViewExecution(budget.id)}>
                                                        <BarChart3 className="mr-2 h-4 w-4" />
                                                        Exécution
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => handleDelete(budget.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <BudgetDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} budgetToEdit={selectedBudget} />
        </>
    );
};
