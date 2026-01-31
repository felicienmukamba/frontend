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
    useGetCreditNotesQuery,
    useDeleteCreditNoteMutation,
} from '../api/salesApi';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreditNote } from '../types';
import { extractArray } from '@/lib/utils';
import { CreditNoteDialog } from './CreditNoteDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const CreditNoteList = () => {
    const { data, isLoading, error } = useGetCreditNotesQuery({});
    const [deleteCreditNote] = useDeleteCreditNoteMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);

    const creditNotes = extractArray<CreditNote>(data);

    const handleCreate = () => {
        setSelectedCreditNote(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (creditNote: CreditNote) => {
        setSelectedCreditNote(creditNote);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette note de crédit ?')) {
            try {
                await deleteCreditNote(id).unwrap();
                toast.success('Note de crédit supprimée');
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
        return <div className="text-red-500">Erreur lors du chargement des notes de crédit.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Notes de Crédit</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nouvelle note
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Montant TTC</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {creditNotes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        Aucune note de crédit trouvée
                                    </TableCell>
                                </TableRow>
                            ) : (
                                creditNotes.map((cn) => (
                                    <TableRow key={cn.id}>
                                        <TableCell className="font-medium">{cn.creditNoteNumber}</TableCell>
                                        <TableCell>
                                            {format(new Date(cn.issuedAt), 'dd/MM/yyyy', { locale: fr })}
                                        </TableCell>
                                        <TableCell>{cn.client?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {cn.type === 'REFUND' ? 'Remboursement' : 'Annulation'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {cn.totalAmountInclTax.toLocaleString('fr-FR')} {cn.currency}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    cn.status === 'VALIDATED'
                                                        ? 'default'
                                                        : cn.status === 'CANCELED'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                }
                                            >
                                                {cn.status === 'DRAFT' && 'Brouillon'}
                                                {cn.status === 'VALIDATED' && 'Validée'}
                                                {cn.status === 'CANCELED' && 'Annulée'}
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
                                                    {cn.status === 'DRAFT' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEdit(cn)}>
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => handleDelete(cn.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </>
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
            <CreditNoteDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} creditNoteToEdit={selectedCreditNote} />
        </>
    );
};
