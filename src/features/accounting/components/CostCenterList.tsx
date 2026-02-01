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
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import {
    useGetCostCentersQuery,
    useDeleteCostCenterMutation,
} from '../api/accountingApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { CostCenter } from '../types';
import { extractArray } from '@/lib/utils';
import { CostCenterDialog } from './CostCenterDialog';

export const CostCenterList = () => {
    const { data, isLoading, error } = useGetCostCentersQuery();
    const [deleteCostCenter] = useDeleteCostCenterMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);

    const costCenters = extractArray<CostCenter>(data);

    const handleCreate = () => {
        setSelectedCostCenter(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (costCenter: CostCenter) => {
        setSelectedCostCenter(costCenter);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce centre de coût ?')) {
            try {
                await deleteCostCenter(id).unwrap();
                toast.success('Centre de coût supprimé');
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
        return <div className="text-red-500">Erreur lors du chargement des centres de coûts.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Centres de Coûts</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Ajouter centre
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Désignation</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costCenters.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Aucun centre de coût trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                costCenters.map((cc) => (
                                    <TableRow key={cc.id}>
                                        <TableCell className="font-medium">{cc.code}</TableCell>
                                        <TableCell>{cc.name}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(cc)}>
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => handleDelete(cc.id)}
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
            <CostCenterDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} costCenterToEdit={selectedCostCenter} />
        </>
    );
};
