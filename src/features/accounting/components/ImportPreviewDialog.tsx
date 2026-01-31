'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { BadgeDRC } from '@/components/ui/PremiumTable';
import { useImportAccountsMutation } from '../api/accountingApi';
import { toast } from 'sonner';
import { AccountType } from '../types';

interface ImportPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any[];
    onSuccess: () => void;
}

export function ImportPreviewDialog({ open, onOpenChange, data, onSuccess }: ImportPreviewDialogProps) {
    const [importAccounts] = useImportAccountsMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleConfirmImport = async () => {
        setIsSubmitting(true);
        setProgress(10);

        try {
            // Generate CSV content from the preview data
            // Backend expects: accountNumber, label, accountClass, type, isReconcilable, isAuxiliary
            // AccountsService sorts by length of accountNumber.
            const csvHeader = "accountNumber,label,accountClass,type,isReconcilable,isAuxiliary\n";
            const csvRows = data.map(row => {
                // Use explicitly mapped properties or fallbacks
                const num = String(row.accountNumber || row['Numéro'] || row['Compte'] || '').trim();
                const label = String(row.label || row['Libellé'] || row['Nom'] || '').trim();
                // Ensure class is valid number
                let cls = Number(row.accountClass || row['Classe']);
                if (isNaN(cls) || cls === 0) {
                    cls = Number(num[0]) || 1;
                }

                const type = row.type || row['Type'] || 'ASSET';
                const isRec = Boolean(row.isReconcilable || row['Lettrable']);
                const isAux = Boolean(row.isAuxiliary || row['Auxiliaire']);

                // Escape quotes if necessary
                const safeLabel = label.includes(',') ? `"${label}"` : label;

                return `${num},${safeLabel},${cls},${type},${isRec},${isAux}`;
            }).filter(row => row.startsWith(',') === false).join("\n");

            const csvContent = csvHeader + csvRows;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const formData = new FormData();
            formData.append('file', blob, 'import_generated.csv');

            setProgress(50);
            const result = await importAccounts(formData).unwrap();

            setProgress(100);
            toast.success(result?.message || `Importation réussie !`);
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            const msg = error?.data?.message || error?.message || "Erreur inconnue";

            if (msg === '0 importations verifier votre fichier et son contenu') {
                toast.error("Échec de l'importation", {
                    description: msg
                });
                onOpenChange(false);
                return;
            }

            console.error('Import failed details:', JSON.stringify(error, null, 2));
            toast.error("Échec de l'importation", {
                description: typeof msg === 'string' ? msg : JSON.stringify(msg)
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                        <UploadCloud className="h-6 w-6 text-drc-blue" />
                        Prévisualisation de l'importation
                    </DialogTitle>
                    <DialogDescription>
                        Vérifiez les données ci-dessous avant de valider l'importation en base de données.
                        <br />
                        <span className="font-bold text-slate-700">{data.length} lignes détectées.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-xl border border-slate-100 overflow-hidden mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Numéro</TableHead>
                                <TableHead>Libellé</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Options</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                                        Aucune donnée à importer. Vérifiez votre fichier.
                                    </TableCell>
                                </TableRow>
                            ) : data.slice(0, 50).map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-mono font-bold text-drc-blue">
                                        {row.accountNumber || row['Numéro'] || row['Compte']}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {row.label || row['Libellé'] || row['Nom']}
                                    </TableCell>
                                    <TableCell>
                                        <BadgeDRC variant="slate">CL {row.accountClass || row['Classe'] || String(row.accountNumber || '')[0]}</BadgeDRC>
                                    </TableCell>
                                    <TableCell>
                                        {row.type || row['Type'] || 'ASSET'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {(row.isReconcilable || row['Lettrable']) && <BadgeDRC variant="green">Lettrable</BadgeDRC>}
                                            {(row.isAuxiliary || row['Auxiliaire']) && <BadgeDRC variant="yellow">Aux</BadgeDRC>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length > 50 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-slate-400 italic py-4">
                                        ... et {data.length - 50} autres lignes
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                    {isSubmitting && (
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-drc-blue h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleConfirmImport}
                            disabled={isSubmitting || data.length === 0}
                            className="bg-drc-blue hover:bg-blue-700 text-white font-bold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importation ({progress}%)
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Confirmer l'importation
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
