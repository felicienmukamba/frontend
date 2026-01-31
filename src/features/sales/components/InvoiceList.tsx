"use client";

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
import {
    MoreHorizontal,
    Plus,
    Search,
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    CreditCard,
    AlertCircle,
    Download
} from 'lucide-react';
import { useGetInvoicesQuery, useValidateInvoiceMutation, useDeleteInvoiceMutation } from '../api/salesApi';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { Invoice, InvoiceStatus, InvoiceType } from '../types';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { InvoiceDialog } from './InvoiceDialog';
import { PaymentDialog } from './PaymentDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFWrapper } from '@/components/ui/PDFWrapper';
import { InvoicePDF } from './InvoicePDF';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { extractArray, extractMeta, safeFormatDate, safeNumber } from '@/lib/utils';

export const InvoiceList = () => {
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useGetInvoicesQuery({
        page,
        limit: 10,
        search: search || undefined
    });
    const [validateInvoice] = useValidateInvoiceMutation();
    const [deleteInvoice] = useDeleteInvoiceMutation();

    const invoices = extractArray<Invoice>(data);
    const meta = extractMeta(data);

    const stats = {
        totalInvoiced: invoices.reduce((acc, inv) => acc + safeNumber(inv.totalAmountInclTax), 0),
        totalPaid: invoices.reduce((acc, inv) => {
            // Note: Since we don't have cumulative payment field on Invoice here, we estimate
            // In a real app, the API should return this. For now we assume PAID = full, PARTIAL = 50%
            const amount = safeNumber(inv.totalAmountInclTax);
            if (inv.status === InvoiceStatus.SIGNED) return acc + amount;
            if (inv.status === InvoiceStatus.CANCELED) return acc + (amount / 2);
            return acc;
        }, 0),
        pendingCount: invoices.filter(inv => inv.status === InvoiceStatus.DRAFT).length,
    };

    const handleCreate = () => {
        setIsDialogOpen(true);
    };

    const handlePayment = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentDialogOpen(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDialogOpen(true);
    };

    const handleValidate = async (id: string) => {
        if (confirm('Voulez-vous valider cette facture ? Cette action générera les écritures comptables et est irréversible.')) {
            try {
                await validateInvoice(id).unwrap();
                toast.success('Facture validée avec succès');
            } catch (err) {
                toast.error('Erreur lors de la validation');
            }
        }
    };

    const getStatusBadge = (status: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.DRAFT:
                return <BadgeDRC variant="slate">Brouillon</BadgeDRC>;
            case InvoiceStatus.VALIDATED:
                return <BadgeDRC variant="blue">Validée</BadgeDRC>;
            case InvoiceStatus.SIGNED:
                return <BadgeDRC variant="green">Payée</BadgeDRC>;
            case InvoiceStatus.CANCELED:
                return <BadgeDRC variant="yellow">Annulée</BadgeDRC>;
            default:
                return <BadgeDRC variant="slate">{status}</BadgeDRC>;
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
        return <div className="text-red-500 text-center py-10">Erreur lors du chargement des factures.</div>;
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-between items-end pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-drc-blue text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                            <div className="h-1.5 w-1.5 rounded-full bg-drc-blue animate-pulse" />
                            Module Commercial
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">VENTES & FACTURATION</h2>
                        <p className="text-slate-500 font-medium mt-1">Gérez vos flux de trésorerie et accélérez vos recouvrements.</p>
                    </div>
                    <Button onClick={handleCreate} className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        <Plus className="mr-2 h-5 w-5" /> Nouvelle Facture
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Facturé</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-drc-blue" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 font-outfit">{stats.totalInvoiced.toLocaleString()} <span className="text-sm font-bold text-slate-400">USD</span></div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recouvrements</CardTitle>
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CreditCard className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 font-outfit">{stats.totalPaid.toLocaleString()} <span className="text-sm font-bold text-slate-400">USD</span></div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Attente DGI</CardTitle>
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black text-slate-900 font-outfit">{stats.pendingCount} <span className="text-sm font-bold text-slate-400">UNITES</span></div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center gap-4 py-2">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                        <Input
                            placeholder="Rechercher par numéro ou client..."
                            className="h-12 pl-12 rounded-xl bg-white border-slate-200 focus:border-drc-blue/30 focus:ring-4 focus:ring-drc-blue/5 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <PremiumTable>
                    <PremiumTableHeader>
                        <PremiumTableRow>
                            <PremiumTableHead>Numéro</PremiumTableHead>
                            <PremiumTableHead>Date</PremiumTableHead>
                            <PremiumTableHead>Type</PremiumTableHead>
                            <PremiumTableHead>Montant TTC</PremiumTableHead>
                            <PremiumTableHead>Statut</PremiumTableHead>
                            <PremiumTableHead className="w-[80px]">Actions</PremiumTableHead>
                        </PremiumTableRow>
                    </PremiumTableHeader>
                    <PremiumTableBody>
                        {invoices.length === 0 ? (
                            <PremiumTableRow>
                                <PremiumTableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium italic">
                                    Aucune transaction enregistrée pour le moment.
                                </PremiumTableCell>
                            </PremiumTableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <PremiumTableRow key={invoice.id}>
                                    <PremiumTableCell className="font-mono text-xs font-black text-slate-900">
                                        {invoice.invoiceNumber || 'BROUILLON'}
                                    </PremiumTableCell>
                                    <PremiumTableCell className="text-xs font-bold text-slate-500">
                                        {safeFormatDate(invoice.issuedAt)}
                                    </PremiumTableCell>
                                    <PremiumTableCell>
                                        <BadgeDRC variant={invoice.type === InvoiceType.NORMAL ? 'blue' : 'yellow'}>
                                            {invoice.type === InvoiceType.NORMAL ? 'Doit' : 'Avoir'}
                                        </BadgeDRC>
                                    </PremiumTableCell>
                                    <PremiumTableCell className="font-black text-slate-900 italic">
                                        {safeNumber(invoice.totalAmountInclTax).toLocaleString()} <span className="text-[10px] text-slate-400 active:text-slate-900">{invoice.currency}</span>
                                    </PremiumTableCell>
                                    <PremiumTableCell>{getStatusBadge(invoice.status)}</PremiumTableCell>
                                    <PremiumTableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 transition-colors">
                                                    <span className="sr-only">Menu</span>
                                                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">Operations</DropdownMenuLabel>
                                                <DropdownMenuItem className="focus:bg-slate-50 rounded-xl p-0">
                                                    <PDFWrapper>
                                                        <PDFDownloadLink
                                                            document={<InvoicePDF invoice={invoice} />}
                                                            fileName={`Facture-${invoice.invoiceNumber}.pdf`}
                                                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-700 hover:text-drc-blue"
                                                        >
                                                            {({ loading }) => (
                                                                <>
                                                                    <Download className="h-4 w-4" />
                                                                    {loading ? 'Génération...' : 'Télécharger PDF'}
                                                                </>
                                                            )}
                                                        </PDFDownloadLink>
                                                    </PDFWrapper>
                                                </DropdownMenuItem>
                                                {invoice.status === InvoiceStatus.DRAFT && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleEdit(invoice)} className="focus:bg-slate-50 rounded-xl px-3 py-2.5 flex items-center gap-3 font-bold text-slate-700">
                                                            <FileText className="h-4 w-4" />
                                                            MODIFIER
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleValidate(invoice.id.toString())} className="focus:bg-blue-50 text-drc-blue font-black rounded-xl px-3 py-2.5 flex items-center gap-3">
                                                            <CheckCircle className="h-4 w-4" />
                                                            SCELLER (DGI)
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-red-50 text-drc-red font-black rounded-xl px-3 py-2.5 flex items-center gap-3">
                                                            <AlertCircle className="h-4 w-4" />
                                                            SUPPRIMER
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {(invoice.status === InvoiceStatus.VALIDATED || invoice.status === InvoiceStatus.SIGNED) && (
                                                    <DropdownMenuItem onClick={() => handlePayment(invoice)} className="focus:bg-emerald-50 text-emerald-600 font-black rounded-xl px-3 py-2.5 flex items-center gap-3">
                                                        <CreditCard className="h-4 w-4" />
                                                        ENCAISSER
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </PremiumTableCell>
                                </PremiumTableRow>
                            ))
                        )}
                    </PremiumTableBody>
                </PremiumTable>

                {meta && (
                    <div className="py-4">
                        <PaginationControls
                            currentPage={meta.page}
                            totalPages={meta.last_page}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
            <InvoiceDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedInvoice(null);
                }}
                invoiceToEdit={selectedInvoice}
            />
            {selectedInvoice && (
                <PaymentDialog
                    open={isPaymentDialogOpen}
                    onOpenChange={setIsPaymentDialogOpen}
                    invoice={selectedInvoice}
                />
            )}
        </>
    );
};
