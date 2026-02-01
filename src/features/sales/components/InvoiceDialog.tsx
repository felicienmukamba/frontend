'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
    Plus,
    Trash2,
    Loader2,
    Receipt,
    Users2,
    Layers,
    Wallet,
    Banknote,
    ShieldCheck,
    ChevronRight,
    Search,
    AlertCircle
} from 'lucide-react';
import {
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useValidateInvoiceMutation,
    useCreatePaymentMutation,
    useGetTaxesQuery,
} from '../api/salesApi';
import { useGetThirdPartiesQuery, useGetProductsQuery } from '@/features/resources/api/resourcesApi';
import { Product, ThirdParty, ThirdPartyType } from '@/features/resources/types';
import { Tax, CreateInvoiceRequest, Invoice } from '../types/salesTypes';
import { useAuth } from '@/features/auth/lib/auth-provider';
import { ThirdPartyDialog } from '@/features/resources/components/ThirdPartyDialog';
import { PremiumTable, PremiumTableBody, PremiumTableCell, PremiumTableHead, PremiumTableHeader, PremiumTableRow } from '@/components/ui/PremiumTable';
import { safeNumber, extractArray } from '@/lib/utils';

const invoiceLineSchema = z.object({
    productId: z.number().min(1, "Requis"),
    description: z.string().min(1, "Requis"),
    quantity: z.number().min(0.01, "Min 0.01"),
    unitPrice: z.number().min(0, "Min 0"),
    taxId: z.number().min(1, "Requis"),
    discountRate: z.number().min(0).max(100).optional(),
});

const invoiceSchema = z.object({
    thirdPartyId: z.number().min(1, "Veuillez sélectionner un client"),
    invoiceNumber: z.string().min(1, "Requis"),
    issuedAt: z.string().min(1, "Requis"),
    currency: z.string().optional(),
    exchangeRate: z.number().optional(),
    observation: z.string().optional(),
    lines: z.array(invoiceLineSchema).min(1, "Au moins une ligne"),
    isPaid: z.boolean().optional(),
    paymentMethod: z.string().optional(),
    paymentDate: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceToEdit?: Invoice | null;
}

export function InvoiceDialog({ open, onOpenChange, invoiceToEdit }: InvoiceDialogProps) {
    const { user, companyId } = useAuth();
    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

    const { data: taxesData } = useGetTaxesQuery(undefined);
    const { data: productsData } = useGetProductsQuery({});
    const { data: clientsData } = useGetThirdPartiesQuery({ type: ThirdPartyType.CUSTOMER });

    const taxes = extractArray<Tax>(taxesData);
    const products = extractArray<Product>(productsData);
    const clients = extractArray<ThirdParty>(clientsData);

    const standardTax = taxes.find((t: Tax) => t.id && t.rate === 16) || taxes[0];

    const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
    const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();
    const [validateInvoice, { isLoading: isValidating }] = useValidateInvoiceMutation();
    const [createPayment, { isLoading: isPaying }] = useCreatePaymentMutation();

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            invoiceNumber: `FACT-${Date.now().toString().slice(-6)}`,
            issuedAt: new Date().toISOString().split('T')[0],
            currency: 'USD',
            exchangeRate: 1,
            thirdPartyId: 0,
            observation: '',
            lines: [{ productId: 0, description: '', quantity: 1, unitPrice: 0, taxId: standardTax?.id || 0, discountRate: 0 }],
            isPaid: false,
            paymentMethod: 'CASH',
            paymentDate: new Date().toISOString().split('T')[0],
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (invoiceToEdit) {
            form.reset({
                invoiceNumber: invoiceToEdit.invoiceNumber,
                issuedAt: invoiceToEdit.issuedAt.split('T')[0],
                currency: invoiceToEdit.currency || 'USD',
                exchangeRate: invoiceToEdit.exchangeRate || 1,
                thirdPartyId: invoiceToEdit.clientId,
                observation: invoiceToEdit.observation || '',
                lines: invoiceToEdit.invoiceLines.map(line => ({
                    productId: line.productId,
                    description: line.description,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    taxId: line.taxId,
                    discountRate: line.discountRate || 0,
                })),
                isPaid: false,
            });
        }
    }, [invoiceToEdit, form, standardTax]);

    // ... hooks ...

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    });

    const watchLines = useWatch({
        control: form.control,
        name: 'lines',
    });

    const watchIsPaid = useWatch({
        control: form.control,
        name: 'isPaid',
    });

    const totals = useMemo(() => {
        let subtotal = 0;
        let totalVat = 0;

        if (!watchLines) return { subtotal: 0, totalVat: 0, totalInclTax: 0 };

        watchLines.forEach((line: any) => {
            const tax = taxes?.find((t: Tax) => t.id === Number(line?.taxId));
            const rate = tax ? Number(tax.rate) : 0;
            const quantity = Number(line?.quantity) || 0;
            const unitPrice = Number(line?.unitPrice) || 0;
            const discRate = Number(line?.discountRate) || 0;

            const lineGross = quantity * unitPrice;
            const lineDisc = lineGross * (discRate / 100);
            const lineNet = lineGross - lineDisc;

            subtotal += lineNet;
            totalVat += lineNet * (rate / 100);
        });

        // Rounding to 2 decimal places to avoid standard JS floating point errors
        subtotal = Math.round((subtotal + Number.EPSILON) * 100) / 100;
        totalVat = Math.round((totalVat + Number.EPSILON) * 100) / 100;

        return {
            subtotal,
            totalVat,
            totalInclTax: subtotal + totalVat,
        };
    }, [watchLines, taxes]);

    const onSubmit = async (data: InvoiceFormValues) => {
        const toastId = toast.loading('Génération de la facture...');
        try {
            if (!user || !companyId) {
                toast.error('Erreur: Session invalide', { id: toastId, description: 'Utilisateur ou Société non identifié.' });
                return;
            }

            // Mapping lines with business calculations
            const invoiceLines = data.lines.map((line: any) => {
                const taxRate = taxes.find((t: Tax) => t.id === line.taxId)?.rate || 0;
                const grossAmount = line.quantity * line.unitPrice;
                const discountAmount = grossAmount * ((line.discountRate || 0) / 100);
                const netAmountExclTax = grossAmount - discountAmount;
                const vatAmount = netAmountExclTax * (taxRate / 100);
                const totalAmountInclTax = netAmountExclTax + vatAmount;
                return {
                    productId: Number(line.productId),
                    description: line.description,
                    quantity: Number(line.quantity),
                    unitPrice: Number(line.unitPrice),
                    discountRate: Number(line.discountRate) || 0,
                    discountAmount: Number(discountAmount),
                    netAmountExclTax: Number(netAmountExclTax),
                    vatAmount: Number(vatAmount),
                    totalAmountInclTax: Number(totalAmountInclTax),
                    taxId: Number(line.taxId),
                };
            });

            const payload: CreateInvoiceRequest = {
                invoiceNumber: data.invoiceNumber,
                issuedAt: data.issuedAt ? new Date(data.issuedAt).toISOString() : new Date().toISOString(),
                type: 'NORMAL', // Using strict string or import from Enum if available in component scope
                currency: data.currency || 'USD',
                exchangeRate: Number(data.exchangeRate) || 1,
                clientId: Number(data.thirdPartyId),
                companyId: Number(companyId),
                createdById: Number(user.id),
                totalAmountExclTax: Number(totals.subtotal) || 0,
                totalVAT: Number(totals.totalVat) || 0,
                totalAmountInclTax: Number(totals.totalInclTax) || 0,
                status: 'DRAFT',
                observation: data.observation || '',
                invoiceLines: invoiceLines,
            };

            // 1. Create or Update Invoice
            let invoice;
            if (invoiceToEdit) {
                toast.loading('Mise à jour de la facture...', { id: toastId });
                // We're casting payload to any for update because update DTO might differ slightly in strictness
                // or we need to ensure ID is passed separately. Update hook expects {id, data}.
                invoice = await updateInvoice({ id: invoiceToEdit.id.toString(), data: payload as any }).unwrap();
            } else {
                invoice = await createInvoice(payload).unwrap();
            }

            if (data.isPaid && !invoiceToEdit) {
                // 2. Validate Invoice
                toast.loading('Validation fiscale...', { id: toastId });
                await validateInvoice(invoice.id.toString()).unwrap();

                // 3. Record Payment
                toast.loading('Enregistrement du règlement...', { id: toastId });
                await createPayment({
                    companyId: Number(companyId),
                    invoiceId: invoice.id,
                    amountPaid: Number(totals.totalInclTax),
                    paidAt: data.paymentDate ? new Date(data.paymentDate).toISOString() : new Date().toISOString(),
                    method: (data.paymentMethod || 'CASH') as any, // Cast to match Enum strictness if needed
                    externalReference: `Vente Directe - ${data.invoiceNumber}`,
                    observation: 'Règlement comptant au guichet',
                }).unwrap();

                toast.success('✅ Facture Payée & Validée !', {
                    id: toastId,
                    description: '📊 Écritures comptables auto-générées'
                });
            } else {
                toast.success(invoiceToEdit ? '✅ Facture mise à jour' : '✅ Facture créée en brouillon', {
                    id: toastId,
                });
            }

            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            console.error('Submission error:', error);

            // Extract meaningful error message from backend response
            // NestJS often returns { statusCode: 400, message: "My error message", ... }
            let errorMessage = 'Une erreur est survenue lors de l\'enregistrement.';

            if (error?.data?.message) {
                errorMessage = Array.isArray(error.data.message)
                    ? error.data.message.join(', ') // Class-validator returns array of strings
                    : error.data.message;
            } else if (error?.data?.error) {
                errorMessage = error.data.error;
            }

            // Display specific error for duplicates (e.g. 500 P2002 translated by backend or raw 400)
            if (errorMessage.includes('unique constraint') || errorMessage.includes('existe déjà')) {
                errorMessage = "Ce numéro de facture existe déjà. Veuillez en choisir un autre.";
            }

            toast.error('Échec de l\'opération', {
                id: toastId,
                description: errorMessage,
                duration: 5000,
            });
        }
        setIsClientDialogOpen(false);
    };

    const handleProductChange = (index: number, productId: number) => {
        const product = products.find((p: Product) => p.id === productId);
        if (product) {
            form.setValue(`lines.${index}.unitPrice`, Number(product.salesPriceExclTax) || 0);
            form.setValue(`lines.${index}.description`, product.name);
            if (!form.getValues(`lines.${index}.taxId`)) {
                const stdTax = taxes.find((t: Tax) => t.rate === 16) || taxes[0];
                if (stdTax) form.setValue(`lines.${index}.taxId`, stdTax.id);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1100px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-drc-blue/20 p-2 rounded-xl backdrop-blur-sm border border-drc-blue/30">
                                    <Receipt className="h-5 w-5 text-drc-blue" />
                                </div>
                                <div className="flex gap-1">
                                    <div className="h-1 w-2 bg-drc-blue rounded-full pulse" />
                                    <div className="h-1 w-2 bg-drc-yellow rounded-full" />
                                    <div className="h-1 w-2 bg-drc-red rounded-full" />
                                </div>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur-md">
                                Certifié DGI & OHADA • SYSCOHADA Rév.
                            </div>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            FACTURATION COMMERCIALE
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Émission et validation fiscale des documents de vente.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="bg-white p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                console.error('Form validation errors:', errors);
                                toast.error('Veuillez corriger les erreurs dans le formulaire');
                            })}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                                <FormField
                                    control={form.control as any}
                                    name="thirdPartyId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2 col-span-2">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Users2 className="h-3 w-3" /> Partenaire Client
                                            </FormLabel>
                                            <div className="flex gap-2">
                                                <Select
                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value ? field.value.toString() : undefined}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-white font-bold text-drc-blue flex-1">
                                                            <SelectValue placeholder="Sélectionner un client..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="max-h-[300px]">
                                                        {clients.map((c: any) => (
                                                            <SelectItem key={c.id} value={c.id.toString()} className="font-bold">
                                                                {c.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Button type="button" variant="outline" size="icon" onClick={() => setIsClientDialogOpen(true)} className="h-12 w-12 rounded-xl border-slate-100 text-drc-blue hover:bg-drc-blue hover:text-white transition-all p-0">
                                                    <Plus className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control as any}
                                        name="invoiceNumber"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Numéro de Pièce</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12 rounded-xl border-slate-100 bg-white font-mono font-bold text-slate-900" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Devise</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} defaultValue="USD">
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-white font-bold text-slate-900">
                                                            <SelectValue placeholder="Devise" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="USD">USD ($)</SelectItem>
                                                        <SelectItem value="CDF">CDF (FC)</SelectItem>
                                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control as any}
                                    name="issuedAt"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Date d'Émission</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="h-12 rounded-xl border-slate-100 bg-white font-bold" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <Layers className="h-3 w-3" /> Lignes de facturation
                                    </h3>
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: 0, description: '', quantity: 1, unitPrice: 0, taxId: standardTax?.id || 0, discountRate: 0 })} className="h-8 px-4 rounded-lg border-drc-blue/20 text-drc-blue hover:bg-drc-blue hover:text-white font-bold text-[10px] transition-all">
                                        <Plus className="mr-1 h-3 w-3" /> AJOUTER UNE LIGNE
                                    </Button>
                                </div>

                                <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                                    <PremiumTable>
                                        <PremiumTableHeader>
                                            <PremiumTableRow className="bg-slate-50/80">
                                                <PremiumTableHead className="w-[30%]">Article / Service</PremiumTableHead>
                                                <PremiumTableHead className="w-[10%] text-center">Qté</PremiumTableHead>
                                                <PremiumTableHead className="w-[15%]">Prix Unitaire</PremiumTableHead>
                                                <PremiumTableHead className="w-[10%] text-center">Remise %</PremiumTableHead>
                                                <PremiumTableHead className="w-[15%]">Taxe (TVA)</PremiumTableHead>
                                                <PremiumTableHead className="w-[15%] text-right">Total HT</PremiumTableHead>
                                                <PremiumTableHead className="w-[5%]"></PremiumTableHead>
                                            </PremiumTableRow>
                                        </PremiumTableHeader>
                                        <PremiumTableBody>
                                            {fields.map((field, index) => (
                                                <PremiumTableRow key={field.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <PremiumTableCell>
                                                        <FormField
                                                            control={form.control as any}
                                                            name={`lines.${index}.productId`}
                                                            render={({ field }) => (
                                                                <div className="relative">
                                                                    <FormControl>
                                                                        <Input
                                                                            key={`prod-${field.value}`}
                                                                            list={`products-list-${index}`}
                                                                            placeholder="Chercher article..."
                                                                            className="h-10 border-slate-100 bg-white font-bold text-xs rounded-lg"
                                                                            defaultValue={products.find(p => p.id === field.value)?.name || ''}
                                                                            onChange={(e) => {
                                                                                const search = e.target.value;
                                                                                const product = products.find(p => p.name === search);
                                                                                if (product) {
                                                                                    field.onChange(product.id);
                                                                                    handleProductChange(index, product.id);
                                                                                } else if (search === '') {
                                                                                    field.onChange(0);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <datalist id={`products-list-${index}`}>
                                                                        {products.map((p: Product) => (
                                                                            <option key={p.id} value={p.name}>
                                                                                {p.sku} - {p.name}
                                                                            </option>
                                                                        ))}
                                                                    </datalist>
                                                                </div>
                                                            )}
                                                        />
                                                    </PremiumTableCell>
                                                    <PremiumTableCell>
                                                        <FormField
                                                            control={form.control as any}
                                                            name={`lines.${index}.quantity`}
                                                            render={({ field }) => (
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-10 text-center border-slate-100 bg-white font-black rounded-lg" />
                                                            )}
                                                        />
                                                    </PremiumTableCell>
                                                    <PremiumTableCell>
                                                        <FormField
                                                            control={form.control as any}
                                                            name={`lines.${index}.unitPrice`}
                                                            render={({ field }) => (
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-10 border-slate-100 bg-white font-black rounded-lg" />
                                                            )}
                                                        />
                                                    </PremiumTableCell>
                                                    <PremiumTableCell>
                                                        <FormField
                                                            control={form.control as any}
                                                            name={`lines.${index}.discountRate`}
                                                            render={({ field }) => (
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-10 text-center border-slate-100 bg-yellow-50/30 text-yellow-700 font-black rounded-lg" placeholder="0" />
                                                            )}
                                                        />
                                                    </PremiumTableCell>
                                                    <PremiumTableCell>
                                                        <FormField
                                                            control={form.control as any}
                                                            name={`lines.${index}.taxId`}
                                                            render={({ field }) => (
                                                                <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString() || ""}>
                                                                    <SelectTrigger className="h-10 border-slate-100 bg-white font-bold text-[10px] rounded-lg">
                                                                        <SelectValue placeholder="0%" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-xl border-slate-100">
                                                                        {taxes.map((t: Tax) => (
                                                                            <SelectItem key={t.id} value={t.id.toString()}>{t.rate}% {t.code}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                    </PremiumTableCell>
                                                    <PremiumTableCell className="text-right font-black text-slate-700">
                                                        {(() => {
                                                            const line = watchLines[index];
                                                            const gross = (line?.quantity || 0) * (line?.unitPrice || 0);
                                                            const disc = gross * ((line?.discountRate || 0) / 100);
                                                            return (gross - disc)?.toLocaleString() ?? '0';
                                                        })()} <span className="text-[10px] text-slate-400">USD</span>
                                                    </PremiumTableCell>
                                                    <PremiumTableCell>
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-300 hover:text-drc-red h-8 w-8 p-0 rounded-full transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </PremiumTableCell>
                                                </PremiumTableRow>
                                            ))}
                                        </PremiumTableBody>
                                    </PremiumTable>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between gap-10 pt-6">
                                <div className="flex-1 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <Wallet className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Encaissement Rapide</h4>
                                                <p className="text-[10px] font-bold text-slate-400">RÈGLEMENT IMMÉDIAT EN CAISSE</p>
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control as any}
                                            name="isPaid"
                                            render={({ field }) => (
                                                <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-drc-blue/20">
                                                    <Checkbox
                                                        id="isPaid"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-drc-blue data-[state=checked]:border-drc-blue"
                                                    />
                                                    <label htmlFor="isPaid" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                                                        Vente payée au comptant
                                                    </label>
                                                </div>
                                            )}
                                        />

                                        {watchIsPaid && (
                                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <FormField
                                                    control={form.control as any}
                                                    name="paymentMethod"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Mode de Paiement</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-10 rounded-lg border-slate-100 bg-white font-bold text-xs">
                                                                        <SelectValue placeholder="Mode" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="rounded-xl">
                                                                    <SelectItem value="CASH" className="font-medium">CASH (ESPÈCES)</SelectItem>
                                                                    <SelectItem value="BANK_TRANSFER" className="font-medium">BANQUE (VIREMENT)</SelectItem>
                                                                    <SelectItem value="MOBILE_MONEY" className="font-medium">MOBILE MONEY</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control as any}
                                                    name="paymentDate"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Date Règlement</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} className="h-10 rounded-lg border-slate-100 bg-white font-bold text-xs" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <FormField
                                        control={form.control as any}
                                        name="observation"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Observations / Notes spécialisées</FormLabel>
                                                <FormControl>
                                                    <textarea {...field} rows={3} className="w-full p-4 rounded-2xl border border-slate-100 bg-white font-medium text-xs outline-none focus:ring-4 focus:ring-drc-blue/5 transition-all" placeholder="Notes visibles par le client ou remarques internes..." />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col items-end space-y-4 min-w-[320px] p-2">
                                    <div className="w-full space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200">
                                        <div className="flex justify-between items-center text-slate-400 uppercase tracking-widest text-[9px] font-black">
                                            <span>Base Imposable (HT)</span>
                                            <span className="font-mono text-slate-600 font-bold">{safeNumber(totals.subtotal).toLocaleString()} USD</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400 uppercase tracking-widest text-[9px] font-black">
                                            <span>Montant TVA</span>
                                            <span className="font-mono text-slate-600 font-bold text-drc-red">{safeNumber(totals.totalVat).toLocaleString()} USD</span>
                                        </div>
                                        <Separator className="bg-slate-200 h-[1px]" />
                                        <div className="flex justify-between items-end pt-2">
                                            <div>
                                                <div className="text-[10px] font-black text-drc-blue uppercase tracking-[0.2em]">NET À PAYER (TTC)</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Devise : {form.getValues('currency')} </div>
                                            </div>
                                            <div className="text-4xl font-black text-slate-900 flex items-baseline gap-2">
                                                {safeNumber(totals.totalInclTax).toLocaleString()}
                                                <span className="text-lg text-slate-400 font-medium">USD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isCreating || isValidating || isPaying}
                                            className="w-full h-20 rounded-[1.5rem] bg-drc-blue hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 transition-all active:scale-[0.97] flex flex-col items-center justify-center gap-1"
                                        >
                                            {isCreating || isValidating || isPaying ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        {watchIsPaid ? <Banknote className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                                                        <span className="text-lg">{watchIsPaid ? 'VALIDER & ENCAISSER' : 'GÉNÉRER FACTURE'}</span>
                                                    </div>
                                                    <span className="text-[10px] opacity-70 font-bold">{watchIsPaid ? 'Règlement comptant' : 'Mise en attente règlement'}</span>
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => onOpenChange(false)}
                                            className="w-full mt-4 h-11 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest"
                                        >
                                            ABANDONNER LA SAISIE
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
            {/* Moved ThirdPartyDialog outside DialogContent but inside Dialog (won't work if DialogContent manages portal).
                Actually, putting it as sibling to DialogContent works if it has its own Portal.
                However, Radix Dialog interaction blocking might still be an issue.
                Best practice: Conditional rendering to ensure clean mount/unmount or just outside.
             */}
            {isClientDialogOpen && (
                <ThirdPartyDialog
                    open={isClientDialogOpen}
                    onOpenChange={setIsClientDialogOpen}
                    initialType={ThirdPartyType.CUSTOMER}
                />
            )}
        </Dialog>
    );
}
