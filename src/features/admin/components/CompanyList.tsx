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
import { MoreHorizontal, Plus } from 'lucide-react';
import { useGetCompaniesQuery, useDeleteCompanyMutation } from '../api/adminApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import { useState } from 'react';
import { CompanyDialog } from './CompanyDialog';
import { Company } from '@/features/admin/types';
import { useAuth } from '@/features/auth/lib/auth-provider';

export const CompanyList = () => {
    const { isSaaSAdmin, companyId } = useAuth();
    const { data, isLoading, error } = useGetCompaniesQuery({
        page: 1,
        limit: 10,
        // For companies, filtering is usually done by showing ONLY the current company unless SaaS Admin
        // However, the SaaS admin sees all. Let's pass companyId if it's restricted.
        companyId: !isSaaSAdmin ? (companyId || undefined) : undefined
    });
    const [deleteCompany] = useDeleteCompanyMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    const handleCreate = () => {
        setSelectedCompany(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (company: Company) => {
        setSelectedCompany(company);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
            try {
                await deleteCompany(id).unwrap();
                toast.success('Entreprise supprimée');
            } catch (err) {
                toast.error('Erreur lors de la suppression');
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
        return <div className="text-red-500">Erreur lors du chargement des entreprises.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Entreprises</h2>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Site Web</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(data?.data || []).map((company) => (
                                <TableRow key={company.id}>
                                    <TableCell className="font-medium">{company.name}</TableCell>
                                    <TableCell>{company.email}</TableCell>
                                    <TableCell>{company.website}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleEdit(company)}>Modifier</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(company.id)}
                                                >
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <CompanyDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} companyToEdit={selectedCompany} />
        </>
    );
};
