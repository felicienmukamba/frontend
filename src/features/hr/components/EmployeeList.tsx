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
import { Button } from '@/components/ui/button';
import {
    Plus,
    CheckCircle,
    Search,
    UserCircle,
    User,
    Users,
    Activity,
    Mail,
    Phone,
    MoreHorizontal
} from 'lucide-react';
import { useGetEmployeesQuery, useCreateEmployeeMutation, useDeleteEmployeeMutation } from '../api/hrApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { EmployeeDialog } from './EmployeeDialog';
import { Employee } from '../types';
import { ExcelImportButton } from '@/components/ui/ExcelImportButton';
import { toast } from 'sonner';
import { extractArray } from '@/lib/utils';

export const EmployeeList = () => {
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    const { data, isLoading, error } = useGetEmployeesQuery({});
    const [createEmployee] = useCreateEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();

    const employees = extractArray<Employee>(data);

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
            try {
                await deleteEmployee(String(id)).unwrap();
                toast.success('Employé supprimé avec succès');
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsDialogOpen(true);
    };

    const handleExcelImport = async (data: any[]) => {
        setIsImporting(true);
        const toastId = toast.loading("Importation des employés en cours...");
        let successCount = 0;
        let errorCount = 0;

        try {
            for (const row of data) {
                const payload = {
                    firstName: String(row.firstName || row['Prénom'] || ''),
                    lastName: String(row.lastName || row['Nom'] || ''),
                    email: String(row.email || row['Email'] || ''),
                    phone: String(row.phone || row['Téléphone'] || ''),
                    position: String(row.position || row['Poste'] || row['Fonction'] || ''),
                    baseSalary: Number(row.baseSalary || row['Salaire'] || 0),
                    status: 'ACTIVE' as const,
                };

                if (payload.firstName && payload.lastName) {
                    try {
                        await createEmployee(payload as any).unwrap();
                        successCount++;
                    } catch (e) {
                        errorCount++;
                    }
                }
            }

            if (successCount > 0) toast.success(`${successCount} employés importés.`, { id: toastId });
            else if (errorCount > 0) toast.error(`${errorCount} échecs d'importation.`, { id: toastId });
            else toast.dismiss(toastId);
        } finally {
            setIsImporting(false);
        }
    };

    const employeeTemplate = [
        { firstName: 'Jean', lastName: 'Mukendi', email: 'j.mukendi@milele.cd', phone: '+243810000000', position: 'Comptable', baseSalary: 1500 },
        { firstName: 'Marie', lastName: 'Kavira', email: 'm.kavira@milele.cd', phone: '+243820000000', position: 'Assistante RH', baseSalary: 800 },
    ];

    const filteredEmployees = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName} ${emp.email}`.toLowerCase().includes(search.toLowerCase()) ||
        emp.position?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-3xl" />
                    <Skeleton className="h-32 rounded-3xl" />
                    <Skeleton className="h-32 rounded-3xl" />
                </div>
                <Skeleton className="h-64 rounded-3xl" />
            </div>
        );
    }

    const activeCount = employees.filter(e => e.status === 'ACTIVE').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-drc-blue animate-pulse" />
                        Capital Humain
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Gestion du Personnel</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez les effectifs et les dossiers administratifs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExcelImportButton
                        onImport={handleExcelImport}
                        templateData={employeeTemplate}
                        fileName="Template_Personnel.xlsx"
                        label="Importer RH"
                        isLoading={isImporting}
                    />
                    <Button
                        className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        onClick={handleAdd}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nouvel Employé
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="h-16 w-16" />
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                        <UserCircle className="h-4 w-4" /> Effectif Total
                    </div>
                    <div className="text-4xl font-black text-slate-900">{employees.length}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-2">COLLABORATEURS ACTIFS</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-green-600">
                        <Activity className="h-16 w-16" />
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Présents
                    </div>
                    <div className="text-4xl font-black text-slate-900">{activeCount}</div>
                    <div className="text-[10px] font-bold text-green-600 mt-2">SUR POSTE CE JOUR</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 py-2 mb-4">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher (Nom, Email, Poste)..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-50 overflow-hidden">
                    <PremiumTable>
                        <PremiumTableHeader>
                            <PremiumTableRow className="bg-slate-50/50">
                                <PremiumTableHead>Collaborateur</PremiumTableHead>
                                <PremiumTableHead>Poste & Rang</PremiumTableHead>
                                <PremiumTableHead>Salaire Base</PremiumTableHead>
                                <PremiumTableHead>Ancienneté</PremiumTableHead>
                                <PremiumTableHead>Statut</PremiumTableHead>
                                <PremiumTableHead className="w-[80px]">Actions</PremiumTableHead>
                            </PremiumTableRow>
                        </PremiumTableHeader>
                        <PremiumTableBody>
                            {filteredEmployees.length === 0 ? (
                                <PremiumTableRow>
                                    <PremiumTableCell colSpan={6} className="text-center py-24 text-slate-400 font-medium italic">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                        Aucun collaborateur trouvé dans vos registres.
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <PremiumTableRow key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                        <PremiumTableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-drc-blue group-hover:text-white transition-colors">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 uppercase">{emp.firstName} {emp.lastName}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 uppercase tracking-tight">
                                                        <Mail className="h-3 w-3" /> {emp.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-black text-[10px] text-drc-blue uppercase tracking-widest">{emp.position || 'Poste non défini'}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">{emp.registrationNumber || 'MAT-0000'}</div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="font-black text-slate-900">{(emp.baseSalary || 0).toLocaleString()} <span className="text-[10px] text-slate-400">USD</span></div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <div className="text-xs font-bold text-slate-600">{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Entrée</div>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <BadgeDRC variant={emp.status === 'ACTIVE' ? "green" : "red"}>
                                                {emp.status}
                                            </BadgeDRC>
                                        </PremiumTableCell>
                                        <PremiumTableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Dossier RH</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(emp)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 font-bold text-slate-700 cursor-pointer">
                                                        MODIFIER PROFIL
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 cursor-pointer"
                                                        onClick={() => handleDelete(emp.id)}
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

            <EmployeeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                employee={selectedEmployee}
            />
        </div>
    );
};

