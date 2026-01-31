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
import { MoreHorizontal, Plus, Lock, Trash2 } from 'lucide-react';
import {
    useGetFiscalYearsQuery,
    useDeleteFiscalYearMutation,
    useCloseFiscalYearMutation,
} from '../api/accountingApi';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { FiscalYear } from '../types';
import { extractArray } from '@/lib/utils';
import { FiscalYearDialog } from './FiscalYearDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const FiscalYearList = () => {
    const { data, isLoading, error } = useGetFiscalYearsQuery();
    const [deleteFiscalYear] = useDeleteFiscalYearMutation();
    const [closeFiscalYear] = useCloseFiscalYearMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFiscalYear, setSelectedFiscalYear] = useState<FiscalYear | null>(null);

    const fiscalYears = extractArray<FiscalYear>(data);

    const handleCreate = () => {
        setSelectedFiscalYear(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (fiscalYear: FiscalYear) => {
        setSelectedFiscalYear(fiscalYear);
        setIsDialogOpen(true);
    };

    const handleClose = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir clôturer cet exercice ? Cette action est irréversible.')) {
            try {
                await closeFiscalYear(id).unwrap();
                toast.success('Exercice clôturé avec succès');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Erreur lors de la clôture');
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
            try {
                await deleteFiscalYear(id).unwrap();
                toast.success('Exercice supprimé');
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
        return <div className="text-red-500">Erreur lors du chargement des exercices fiscaux.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Exercices Fiscaux</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nouvel exercice
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Date début</TableHead>
                                <TableHead>Date fin</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fiscalYears.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        Aucun exercice trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fiscalYears.map((fy) => (
                                    <TableRow key={fy.id}>
                                        <TableCell className="font-medium">{fy.code}</TableCell>
                                        <TableCell>
                                            {format(new Date(fy.startDate), 'dd/MM/yyyy', { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(fy.endDate), 'dd/MM/yyyy', { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={fy.isClosed ? 'secondary' : 'default'}>
                                                {fy.isClosed ? 'Clôturé' : 'Ouvert'}
                                            </Badge>
                                        </TableCell>
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
                                                    {!fy.isClosed && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEdit(fy)}>
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleClose(fy.id)}>
                                                                <Lock className="mr-2 h-4 w-4" />
                                                                Clôturer
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {!fy.isClosed && (
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => handleDelete(fy.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    )}
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
            <FiscalYearDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} fiscalYearToEdit={selectedFiscalYear} />
        </>
    );
};
