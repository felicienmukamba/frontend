import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { BookOpen, Plus, Trash2, XCircle, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/lib/auth-provider';
import {
    useCreateEntryMutation,
    useUpdateEntryMutation,
    useGetJournalsQuery,
    useGetFiscalYearsQuery,
    useGetAccountsQuery,
} from '../api/accountingApi';
import {
    AccountingEntry,
    EntryStatus,
    CreateAccountingEntryDto,
    UpdateAccountingEntryDto,
    Journal,
    FiscalYear,
    Account
} from '../types';
import { extractArray } from '@/lib/utils';

const entryLineSchema = z.object({
    debit: z.number().min(0),
    credit: z.number().min(0),
    description: z.string().min(1),
    accountId: z.number().min(1, 'Compte requis'),
    thirdPartyId: z.number().optional(),
    costCenterId: z.number().optional(),
});

const entrySchema = z.object({
    referenceNumber: z.string().min(1, 'Référence requise'),
    entryDate: z.string().min(1, 'Date requise'),
    description: z.string().min(1, 'Libellé requis'),
    journalId: z.number().min(1, 'Journal requis'),
    fiscalYearId: z.number().min(1, 'Exercice requis'),
    currency: z.string().default('FC'),
    exchangeRate: z.number().default(1),
    status: z.nativeEnum(EntryStatus).default(EntryStatus.PROVISIONAL),
    entryLines: z.array(entryLineSchema).min(2, 'Au moins deux lignes sont requises'),
}).refine((data) => {
    const totalDebit = data.entryLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = data.entryLines.reduce((sum, line) => sum + line.credit, 0);
    return Math.abs(totalDebit - totalCredit) < 0.01; // Allow small rounding differences
}, {
    message: 'Le total débit doit être égal au total crédit',
    path: ['entryLines'],
});

type EntryFormData = z.infer<typeof entrySchema>;

interface EntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entryToEdit?: AccountingEntry | null;
}

export function EntryDialog({ open, onOpenChange, entryToEdit }: EntryDialogProps) {
    const { user, companyId } = useAuth();
    const [createEntry, { isLoading: isCreating }] = useCreateEntryMutation();
    const [updateEntry, { isLoading: isUpdating }] = useUpdateEntryMutation();
    const { data: journalsData } = useGetJournalsQuery();
    const { data: fiscalYearsData } = useGetFiscalYearsQuery();
    const { data: accountsData } = useGetAccountsQuery();

    const journals = extractArray<Journal>(journalsData);
    const fiscalYears = extractArray<FiscalYear>(fiscalYearsData);
    const accounts = extractArray<Account>(accountsData);

    const form = useForm<EntryFormData>({
        resolver: zodResolver(entrySchema) as any,
        defaultValues: {
            referenceNumber: '',
            entryDate: new Date().toISOString().split('T')[0],
            description: '',
            journalId: 0,
            fiscalYearId: 0,
            currency: 'FC',
            exchangeRate: 1,
            status: EntryStatus.PROVISIONAL,
            entryLines: [
                { debit: 0, credit: 0, description: '', accountId: 0 },
                { debit: 0, credit: 0, description: '', accountId: 0 },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'entryLines',
    });

    useEffect(() => {
        if (entryToEdit) {
            form.reset({
                referenceNumber: entryToEdit.referenceNumber,
                entryDate: entryToEdit.entryDate.split('T')[0],
                description: entryToEdit.description,
                journalId: entryToEdit.journalId,
                fiscalYearId: entryToEdit.fiscalYearId,
                currency: entryToEdit.currency,
                exchangeRate: Number(entryToEdit.exchangeRate),
                status: entryToEdit.status,
                entryLines: entryToEdit.entryLines.map(line => ({
                    debit: Number(line.debit),
                    credit: Number(line.credit),
                    description: line.description,
                    accountId: line.accountId,
                    thirdPartyId: line.thirdPartyId,
                    costCenterId: line.costCenterId,
                })),
            });
        } else {
            form.reset({
                referenceNumber: '',
                entryDate: new Date().toISOString().split('T')[0],
                description: '',
                journalId: 0,
                fiscalYearId: fiscalYears.find((fy: any) => !fy.isClosed)?.id || 0,
                currency: 'FC',
                exchangeRate: 1,
                status: EntryStatus.PROVISIONAL,
                entryLines: [
                    { debit: 0, credit: 0, description: '', accountId: 0 },
                    { debit: 0, credit: 0, description: '', accountId: 0 },
                ],
            });
        }
    }, [entryToEdit, form, fiscalYears]);

    const totalDebit = form.watch('entryLines').reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = form.watch('entryLines').reduce((sum, line) => sum + (line.credit || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    const onSubmit = async (data: EntryFormData) => {
        try {
            if (!companyId) {
                toast.error("Session invalide", {
                    description: "Impossible de récupérer l'ID société. Veuillez vous reconnecter."
                });
                return;
            }

            const payload: CreateAccountingEntryDto = {
                ...data,
                companyId: Number(companyId),
                createdById: user?.id || 1,
                entryLines: data.entryLines.map(line => ({
                    debit: line.debit,
                    credit: line.credit,
                    description: line.description,
                    accountId: line.accountId,
                    thirdPartyId: line.thirdPartyId,
                    costCenterId: line.costCenterId,
                })),
            };

            if (entryToEdit) {
                await updateEntry({ id: entryToEdit.id, ...payload }).unwrap();
                toast.success('Écriture mise à jour');
            } else {
                await createEntry(payload).unwrap();
                toast.success('Écriture créée');
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Erreur', { description: error.data?.message || 'Une erreur est survenue' });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' && index === fields.length - 1) {
            e.preventDefault();
            const diff = totalDebit - totalCredit;
            if (Math.abs(diff) > 0) {
                append({
                    debit: diff > 0 ? 0 : Math.abs(diff),
                    credit: diff > 0 ? diff : 0,
                    description: form.getValues(`entryLines.${index}.description`),
                    accountId: 0
                });
            } else {
                append({ debit: 0, credit: 0, description: '', accountId: 0 });
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <div className="p-6 border-b bg-slate-50/50">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                            {entryToEdit ? 'Modifier écriture' : 'Nouvelle saisie comptable'}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">
                            Enregistrez vos flux financiers. L'écriture doit être équilibrée pour être enregistrée.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
                        {/* Header Section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <FormField
                                control={form.control}
                                name="referenceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Référence</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="OD-2024-001" className="h-10 bg-white border-slate-200 focus:ring-4 focus:ring-drc-blue/5 transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="entryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date d'opération</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" className="h-10 bg-white border-slate-200 focus:ring-4 focus:ring-drc-blue/5 transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="journalId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Journal</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 bg-white border-slate-200 font-bold">
                                                    <SelectValue placeholder="Journal" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                                {journals.map((journal: Journal) => (
                                                    <SelectItem key={journal.id} value={journal.id.toString()} className="font-bold py-2.5">
                                                        [{journal.code}] {journal.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fiscalYearId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exercice</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 bg-white border-slate-200 font-bold">
                                                    <SelectValue placeholder="Exercice" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                                {fiscalYears.map((fy: FiscalYear) => (
                                                    <SelectItem key={fy.id} value={fy.id.toString()} className="font-bold py-2.5">
                                                        {fy.code} {fy.isClosed && '(Clôturé)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Libellé général de l'écriture</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Décrire l'opération..." className="min-h-[80px] rounded-2xl bg-white border-slate-200 focus:ring-8 focus:ring-drc-blue/5 transition-all text-sm font-medium p-4" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Lines Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.15em]">Lignes d'imputation comptable</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ debit: 0, credit: 0, description: form.getValues('description'), accountId: 0 })}
                                    className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-bold h-9"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Ajouter ligne
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                                        <FormField
                                            control={form.control}
                                            name={`entryLines.${index}.accountId`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-3">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-full h-11 justify-between text-left font-bold border-slate-200 rounded-xl",
                                                                        !field.value && "text-slate-400 font-medium"
                                                                    )}
                                                                >
                                                                    {field.value
                                                                        ? accounts.find((a: Account) => a.id === field.value)?.accountNumber
                                                                        : "Compte..."}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[300px] p-0 rounded-2xl border-slate-100 shadow-2xl" align="start">
                                                            <Command>
                                                                <CommandInput placeholder="Chercher un compte (n° ou libellé)..." className="h-12 border-none focus:ring-0" />
                                                                <CommandList className="max-h-[300px]">
                                                                    <CommandEmpty>Aucun compte trouvé.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {accounts.map((account: Account) => (
                                                                            <CommandItem
                                                                                key={account.id}
                                                                                value={`${account.accountNumber} ${account.label}`}
                                                                                onSelect={() => {
                                                                                    form.setValue(`entryLines.${index}.accountId`, account.id);
                                                                                    // If description is empty, use general description
                                                                                    if (!form.getValues(`entryLines.${index}.description`)) {
                                                                                        form.setValue(`entryLines.${index}.description`, form.getValues('description'));
                                                                                    }
                                                                                }}
                                                                                className="px-4 py-2.5 font-bold text-slate-700 data-[selected=true]:bg-slate-50"
                                                                            >
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-sm font-black text-drc-blue">{account.accountNumber}</span>
                                                                                    <span className="text-[11px] text-slate-500 uppercase">{account.label}</span>
                                                                                </div>
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto h-4 w-4",
                                                                                        account.id === field.value ? "opacity-100" : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`entryLines.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-4">
                                                    <FormControl>
                                                        <Input {...field} placeholder="Libellé ligne" className="h-11 border-slate-200 rounded-xl font-medium focus:ring-4 focus:ring-slate-50" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`entryLines.${index}.debit`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            step="0.01"
                                                            className="h-11 border-slate-200 rounded-xl font-bold bg-emerald-50/30 text-emerald-700 text-right focus:bg-white transition-all"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`entryLines.${index}.credit`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            step="0.01"
                                                            className="h-11 border-slate-200 rounded-xl font-bold bg-orange-50/30 text-orange-700 text-right focus:bg-white transition-all"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="col-span-1 pt-1.5 flex justify-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                disabled={fields.length <= 2}
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Summary Section */}
                        <div className="flex flex-wrap items-center justify-between p-6 bg-slate-900 rounded-[2rem] border-4 border-white shadow-2xl gap-4">
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Débit</div>
                                    <div className="text-2xl font-black text-emerald-400 font-mono">{totalDebit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Crédit</div>
                                    <div className="text-2xl font-black text-orange-400 font-mono">{totalCredit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</div>
                                </div>
                                <div className="pl-8 border-l border-white/10">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Écart</div>
                                    <div className={cn(
                                        "text-2xl font-black font-mono",
                                        isBalanced ? "text-emerald-500" : "text-red-500"
                                    )}>
                                        {Math.abs(totalDebit - totalCredit).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isBalanced ? (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                                        <Check className="h-4 w-4" /> Écriture Équilibrée
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/20">
                                        <XCircle className="h-4 w-4" /> Déséquilibre Détecté
                                    </div>
                                )}

                                <div className="flex gap-3 ml-4">
                                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border-none">
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isCreating || isUpdating || !isBalanced}
                                        className="h-12 px-8 rounded-xl bg-drc-blue hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-drc-blue/20 disabled:opacity-50 transition-all active:scale-95"
                                    >
                                        {(isCreating || isUpdating) ? (
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        ) : entryToEdit ? (
                                            'Enregistrer modifications'
                                        ) : (
                                            'Enregistrer l\'écriture'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
