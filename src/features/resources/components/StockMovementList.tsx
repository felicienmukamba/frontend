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
    useGetStockMovementsQuery,
    useDeleteStockMovementMutation,
} from '../api/resourcesApi';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { StockMovement } from '../types';
import { extractArray } from '@/lib/utils';
import { StockMovementDialog } from './StockMovementDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const StockMovementList = () => {
    const { data, isLoading, error } = useGetStockMovementsQuery({});
    const [deleteStockMovement] = useDeleteStockMovementMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStockMovement, setSelectedStockMovement] = useState<StockMovement | null>(null);

    const stockMovements = extractArray<StockMovement>(data);

    const handleCreate = () => {
        setSelectedStockMovement(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (stockMovement: StockMovement) => {
        setSelectedStockMovement(stockMovement);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce mouvement de stock ?')) {
            try {
                await deleteStockMovement(id).unwrap();
                toast.success('Mouvement supprimé');
            } catch (err: any) {
                toast.error(err?.data?.message || 'Erreur lors de la suppression');
            }
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            ENTRY: 'Entrée',
            EXIT: 'Sortie',
            TRANSFER: 'Transfert',
            ADJUSTMENT: 'Ajustement',
        };
        return labels[type] || type;
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
        return <div className="text-red-500">Erreur lors du chargement des mouvements de stock.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Mouvements de Stock</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nouveau mouvement
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Produit</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Coût unitaire</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stockMovements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                                        Aucun mouvement trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stockMovements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell>
                                            {format(new Date(movement.movementDate), 'dd/MM/yyyy', { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{getTypeLabel(movement.type)}</Badge>
                                        </TableCell>
                                        <TableCell>{movement.product?.name || '-'}</TableCell>
                                        <TableCell>{movement.quantity}</TableCell>
                                        <TableCell>{movement.unitCost.toLocaleString('fr-FR')}</TableCell>
                                        <TableCell className="font-medium">
                                            {movement.totalCost.toLocaleString('fr-FR')}
                                        </TableCell>
                                        <TableCell>{movement.documentReference || '-'}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(movement)}>
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => handleDelete(movement.id)}
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
            <StockMovementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} stockMovementToEdit={selectedStockMovement} />
        </>
    );
};
