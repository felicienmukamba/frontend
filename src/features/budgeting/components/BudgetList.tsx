'use client';

import {
    PremiumTable,
    PremiumTableBody,
    PremiumTableCell,
    PremiumTableHead,
    PremiumTableHeader,
    PremiumTableRow,
    BadgeDRC
} from '@/components/ui/PremiumTable';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Trash2, BarChart3, Settings2, Target, Briefcase, Calendar } from 'lucide-react';
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
import { BudgetLinesDialog } from './BudgetLinesDialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/lib/auth-provider';

export const BudgetList = () => {
    const router = useRouter();
    const { isSaaSAdmin, companyId } = useAuth();
    const { data, isLoading, error } = useGetBudgetsQuery({
        companyId: !isSaaSAdmin ? (companyId || undefined) : undefined
    });
    const [deleteBudget] = useDeleteBudgetMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLinesDialogOpen, setIsLinesDialogOpen] = useState(false);
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

    const handleManageLines = (budget: Budget) => {
        setSelectedBudget(budget);
        setIsLinesDialogOpen(true);
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
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Gouvernance Financière
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Budgets</h2>
                        <p className="text-slate-500 font-medium mt-1">Définissez vos objectifs financiers et suivez les écarts d'exécution.</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Button
                            className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
                            onClick={handleCreate}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Budget
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-slate-50 overflow-hidden mt-12">
                        <PremiumTable>
                            <PremiumTableHeader>
                                <PremiumTableRow className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <PremiumTableHead>Intitulé & Scope</PremiumTableHead>
                                    <PremiumTableHead>Exercice Fiscal</PremiumTableHead>
                                    <PremiumTableHead>Date de création</PremiumTableHead>
                                    <PremiumTableHead className="w-[80px] text-right">Pilotage</PremiumTableHead>
                                </PremiumTableRow>
                            </PremiumTableHeader>
                            <PremiumTableBody>
                                {budgets.length === 0 ? (
                                    <PremiumTableRow>
                                        <PremiumTableCell colSpan={4} className="text-center py-24 text-slate-400 font-medium italic">
                                            <Target className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                            Aucun budget configuré pour cette période.
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ) : (
                                    budgets.map((budget) => (
                                        <PremiumTableRow key={budget.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <PremiumTableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                                        <Briefcase className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 uppercase tracking-tight">{budget.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{budget.description || 'Sans description detaillee'}</div>
                                                    </div>
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <BadgeDRC variant="blue">
                                                    <Calendar className="mr-1.5 h-3 w-3" /> {budget.fiscalYear?.code || 'N/A'}
                                                </BadgeDRC>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase">
                                                    {budget.createdAt ? new Date(budget.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Pilotage Financier</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(budget)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                            <Settings2 className="mr-2 h-4 w-4" /> MODIFIER RÉGLAGES
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleManageLines(budget)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                            <Target className="mr-2 h-4 w-4" /> GÉRER LES LIGNES
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleViewExecution(budget.id)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                            <BarChart3 className="mr-2 h-4 w-4" /> SUIVI EXÉCUTION
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-red-50 text-red-600 font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                            onClick={() => handleDelete(budget.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> SUPPRIMER
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    ))
                                )}
                            </PremiumTableBody>
                        </PremiumTable>
                    </div>
                </div>
            </div>
            <BudgetDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} budgetToEdit={selectedBudget} />
            <BudgetLinesDialog open={isLinesDialogOpen} onOpenChange={setIsLinesDialogOpen} budget={selectedBudget} />
        </>
    );
};
