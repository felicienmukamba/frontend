'use client';

import { useState } from 'react';
import { BudgetReport } from './BudgetReport';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileBarChart } from 'lucide-react';
import { useGetBudgetExecutionQuery } from '../api/budgetingApi';

export const FinancialReports = () => {
    const [selectedBudgetId, setSelectedBudgetId] = useState<string>('1'); // Default to 1 or handle selection
    const { data: budgetExecution, isLoading } = useGetBudgetExecutionQuery(selectedBudgetId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Rapports Financiers</h2>
                    <p className="text-muted-foreground">Analysez l'exécution budgétaire et les écarts.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileBarChart className="h-5 w-5 text-purple-600" />
                                Exécution Budgétaire
                            </CardTitle>
                            <CardDescription>
                                Vue d'ensemble des prévisions par rapport aux réalisations
                            </CardDescription>
                        </div>
                        {/* Add Budget Selector if multiple budgets exist */}

                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : budgetExecution ? (
                        <BudgetReport data={budgetExecution} />
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Aucune donnée disponible pour le budget sélectionné.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
