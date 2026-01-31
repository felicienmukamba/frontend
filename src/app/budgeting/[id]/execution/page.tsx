'use client';

import { useGetBudgetQuery, useGetBudgetExecutionQuery } from '@/features/budgeting/api/budgetingApi';
import { BudgetReport } from '@/features/budgeting/components/BudgetReport';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default function BudgetExecutionPage({ params }: Props) {
    // In Next.js 15+ params are async, need to be awaited or used with use() hook, 
    // but the component itself is a client component, so we act carefully.
    // However, for simplicity in typical app router we can type props as needing Await or just use them if Next.js version allows.
    // Wait, the user error logs showed "Next.js 16.1.3", so params are async in Page components.
    // But this is a Client Component ('use client'), so params prop is just { id: string } or Promise?
    // In Next.js 15/16 Client Components receiving params might receive them directly if passed from a Server Component parent,
    // but usually in page.tsx [id], params is a Promise.

    // Let's handle params unwrapping for safety or use React.use() if available usually.
    // Or, simpler, make the page Async Server Component and pass data to a Client Component.
    // BUT 'use client' is at top.

    // Let's switch to standard pattern: Page (Server) -> View (Client).
    // But since I'm lazy to make 2 files, I'll try to use `use` from React if available or just assume params is a Promise.

    // Actually, to avoid "Promise" issues in Client Components in Next 15, it's safer to make the Page a Server Component
    // that awaits params and passes ID to a client component.
    // Or just suppress the type issue if we are unsure. 

    // Let's assume standard Next.js 14/15 behavior where Page props params is Promise.
    // I will use a Client Component Wrapper pattern effectively inside this file if needed, 
    // but simpler to just use :

    return <BudgetExecutionView params={params} />;
}

import { use } from 'react';

function BudgetExecutionView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: budget, isLoading: isLoadingBudget } = useGetBudgetQuery(id);
    const {
        data: executionData,
        isLoading: isLoadingExecution,
        refetch
    } = useGetBudgetExecutionQuery(id, {
        pollingInterval: 30000 // Auto-refresh every 30s
    });

    const handlePrint = () => {
        window.print();
    };

    if (isLoadingBudget || isLoadingExecution) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!budget || !executionData) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h2 className="text-xl font-semibold text-red-600">Budget non trouvé ou erreur de chargement.</h2>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Exécution Budgétaire</h1>
                    </div>
                    <p className="text-muted-foreground ml-10">
                        Suivi en temps réel pour <span className="font-semibold text-foreground">{budget.name}</span> (Exercice: {budget.fiscalYear?.code})
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Imprimer
                    </Button>
                </div>
            </div>

            {/* Report Component */}
            <BudgetReport data={executionData} />
        </div>
    );
}
