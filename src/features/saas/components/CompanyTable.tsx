'use client';

import { useState } from 'react';
import {
    Search,
    Building2,
    MoreVertical,
    XCircle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SaaSCompany } from '../api/platformApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CompanyTableProps {
    companies?: SaaSCompany[];
    isLoading: boolean;
    error: any;
    onToggleActivation: (id: number, currentStatus: boolean) => Promise<void>;
}

export function CompanyTable({ companies, isLoading, error, onToggleActivation }: CompanyTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = companies?.filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.taxId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(error)

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une entreprise ou NIF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-10 px-4 rounded-lg bg-orange-50 border-orange-100 text-orange-600 font-bold border-0">
                        {companies?.filter(c => !c.isActive).length} En attente d'activation
                    </Badge>
                </div>
            </div>

            <div className="p-0 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-50">
                            <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8">ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entreprise</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identification</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Installations</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Inscription</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-200" />
                                    </TableCell>
                                </TableRow>
                            ) : (error) ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2 text-rose-500">
                                            <XCircle className="h-8 w-8" />
                                            <p className="font-bold">Erreur lors du chargement des entreprises</p>
                                            <p className="text-xs">{error.data?.message || 'Erreur inconnue'}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (!filteredCompanies || filteredCompanies.length === 0) ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Building2 className="h-12 w-12 opacity-20" />
                                            <p className="font-bold">Aucune entreprise trouvée</p>
                                            <p className="text-xs">Les nouvelles inscriptions apparaîtront ici.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredCompanies.map((company, i) => (
                                <motion.tr
                                    key={company.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-slate-50/50 transition-colors border-slate-50"
                                >
                                    <TableCell className="font-bold text-slate-400 pl-8">#{company.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 tracking-tight">{company.companyName}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{company.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-700">NIF: {company.taxId}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{company.phone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-sm font-black text-slate-900">{company._count?.branches}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Sites</p>
                                            </div>
                                            <div className="h-4 w-[1px] bg-slate-100" />
                                            <div className="text-center">
                                                <p className="text-sm font-black text-slate-900">{company._count?.users}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Users</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-slate-500">
                                        <span suppressHydrationWarning>
                                            {format(new Date(company.createdAt), 'dd MMMM yyyy', { locale: fr })}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {company.isActive ? (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-0 font-black text-[10px] uppercase tracking-widest h-7">Actif</Badge>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-600 border-0 font-black text-[10px] uppercase tracking-widest h-7 animate-pulse">En attente</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                onClick={() => onToggleActivation(company.id, company.isActive)}
                                                className={cn(
                                                    "h-10 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                                    company.isActive
                                                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                                                )}
                                            >
                                                {company.isActive ? 'Désactiver' : 'Activer'}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            <div className="p-8 bg-slate-50/30 flex items-center justify-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Fin de liste - Sécurité SaaS Active</p>
            </div>
        </div>
    );
}
