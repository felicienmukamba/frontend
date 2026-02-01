'use client';

import { useGetBudgetQuery, useGetBudgetExecutionQuery } from '@/features/budgeting/api/budgetingApi';
import { BudgetReport } from '@/features/budgeting/components/BudgetReport';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Printer, Target } from 'lucide-react';
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
        <div className="container mx-auto py-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.back()}
                            className="h-12 w-12 rounded-2xl border-slate-100 shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-400 hover:text-slate-900"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black mb-2 uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
                                <Target className="h-3 w-3 text-emerald-400" />
                                Monitor Executive
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Exécution Budgétaire</h1>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium ml-16">
                        Analyse comparative pour <span className="font-black text-slate-900 uppercase">{budget.name}</span> <span className="mx-2 opacity-20">|</span> <span className="font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">{budget.fiscalYear?.code}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 ml-16 md:ml-0">
                    <Button
                        variant="ghost"
                        className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50"
                        onClick={() => refetch()}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingExecution ? 'animate-spin' : ''}`} /> Actualiser les flux
                    </Button>
                    <Button
                        className="h-12 px-6 rounded-2xl bg-white border border-slate-100 shadow-sm font-black uppercase text-[10px] tracking-widest text-slate-900 hover:bg-slate-50 active:scale-95 transition-all"
                        onClick={handlePrint}
                    >
                        <Printer className="mr-2 h-4 w-4" /> Export Rapport
                    </Button>
                </div>
            </div>

            {/* Report Component */}
            <BudgetReport data={executionData} />
        </div>
    );
}
