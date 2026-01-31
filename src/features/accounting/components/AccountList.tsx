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
import { MoreHorizontal, Plus, Database, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    useGetAccountsQuery,
    useDeleteAccountMutation,
    useCreateAccountMutation,
} from '../api/accountingApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { Account, AccountType } from '../types';
import { extractArray } from '@/lib/utils';
import { ImportPreviewDialog } from './ImportPreviewDialog';
import { AccountDialog } from './AccountDialog';
import { ExcelImportButton } from '@/components/ui/ExcelImportButton';
import { useAuth } from '@/features/auth/lib/auth-provider';

export const AccountList = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useGetAccountsQuery();
    const [deleteAccount] = useDeleteAccountMutation();
    const [createAccount] = useCreateAccountMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // Import Preview State
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [importData, setImportData] = useState<any[]>([]);

    // Filter State
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('ALL');

    const accounts = extractArray<Account>(data);

    const handleCreate = () => {
        setSelectedAccount(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (account: Account) => {
        setSelectedAccount(account);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
            try {
                await deleteAccount(id).unwrap();
                toast.success('Compte supprimé');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const handleExcelImport = (data: any[]) => {
        setImportData(data);
        setIsPreviewOpen(true);
    };

    const accountTemplate = [
        { accountNumber: '101100', label: 'Capital social', accountClass: 1, type: 'LIABILITY', isReconcilable: false, isAuxiliary: false },
        { accountNumber: '411100', label: 'Clients nationaux', accountClass: 4, type: 'ASSET', isReconcilable: true, isAuxiliary: true },
        { accountNumber: '601100', label: 'Achats de marchandises', accountClass: 6, type: 'EXPENSE', isReconcilable: false, isAuxiliary: false },
    ];

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
        return <div className="text-red-500">Erreur lors du chargement des comptes.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                            Référentiel SYSCOHADA
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Plan Comptable</h2>
                        <p className="text-slate-500 font-medium mt-1">Gérez votre architecture financière organisationnelle.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExcelImportButton
                            onImport={handleExcelImport}
                            templateData={accountTemplate}
                            fileName="Template_Plan_Comptable.xlsx"
                            label="Importer Plan"
                        />
                        <Button onClick={handleCreate} className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                            <Plus className="mr-2 h-5 w-5" /> Ajouter Compte
                        </Button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher (Numéro ou Libellé)..."
                                className="h-12 pl-12 rounded-xl bg-slate-50 border-none font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-slate-100 bg-slate-50 font-bold">
                                <SelectValue placeholder="Toutes les classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Toutes les classes</SelectItem>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cls) => (
                                    <SelectItem key={cls} value={String(cls)}>Classe {cls}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <PremiumTable>
                            <PremiumTableHeader>
                                <PremiumTableRow className="bg-slate-50/50">
                                    <PremiumTableHead>Numéro</PremiumTableHead>
                                    <PremiumTableHead>Libellé</PremiumTableHead>
                                    <PremiumTableHead>Classe</PremiumTableHead>
                                    <PremiumTableHead>Type</PremiumTableHead>
                                    <PremiumTableHead>Propriétés</PremiumTableHead>
                                    <PremiumTableHead className="w-[80px]">Actions</PremiumTableHead>
                                </PremiumTableRow>
                            </PremiumTableHeader>
                            <PremiumTableBody>
                                {accounts.length === 0 ? (
                                    <PremiumTableRow>
                                        <PremiumTableCell colSpan={6} className="text-center py-24 text-slate-400 font-medium italic">
                                            <Database className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                            Aucun compte n'a été configuré dans votre référentiel.
                                        </PremiumTableCell>
                                    </PremiumTableRow>
                                ) : (
                                    accounts.map((account) => (
                                        <PremiumTableRow key={account.id} className="hover:bg-slate-50/50 transition-colors">
                                            <PremiumTableCell className="font-mono text-xs font-black text-drc-blue">
                                                {account.accountNumber}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="font-bold text-slate-900 uppercase">
                                                {account.label}
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <BadgeDRC variant="slate">CL {account.accountClass}</BadgeDRC>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <BadgeDRC variant="blue">{account.type}</BadgeDRC>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="flex gap-2">
                                                    {account.isReconcilable && <BadgeDRC variant="green">Lettrable</BadgeDRC>}
                                                    {account.isAuxiliary && <BadgeDRC variant="yellow">Auxiliaire</BadgeDRC>}
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                            <span className="sr-only">Menu</span>
                                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Operations</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(account)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                            MODIFIER
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                            onClick={() => handleDelete(account.id)}
                                                        >
                                                            SUPPRIMER
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
            <AccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} accountToEdit={selectedAccount} />
            <ImportPreviewDialog
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                data={importData}
                onSuccess={() => { }}
            />
        </>
    );
};
