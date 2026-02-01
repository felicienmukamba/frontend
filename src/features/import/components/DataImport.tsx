'use client';

import React from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

type EntityType = 'employees' | 'accounts' | 'companies' | 'thirdParties' | 'products';

interface DataImportProps {
    entityType: EntityType;
    onImportComplete?: () => void;
}

interface ValidationError {
    row: number;
    field: string;
    message: string;
}

export function DataImport({ entityType, onImportComplete }: DataImportProps) {
    const [file, setFile] = React.useState<File | null>(null);
    const [validationResult, setValidationResult] = React.useState<any>(null);
    const [isValidating, setIsValidating] = React.useState(false);
    const [isImporting, setIsImporting] = React.useState(false);
    const [editedData, setEditedData] = React.useState<any[]>([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
                handleValidate(acceptedFiles[0]);
            }
        }
    });

    const handleValidate = async (fileToValidate: File) => {
        setIsValidating(true);

        try {
            const formData = new FormData();
            formData.append('file', fileToValidate);

            const response = await fetch(`/api/import/${entityType}/validate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Validation failed');
            }

            const result = await response.json();
            setValidationResult(result);
            setEditedData(result.data || []);

            if (result.isValid) {
                toast.success(`${result.summary.validRows} lignes validées avec succès`);
            } else {
                toast.error(`${result.errors.length} erreurs détectées`);
            }
        } catch (error) {
            console.error('Validation error:', error);
            toast.error('Erreur lors de la validation du fichier');
        } finally {
            setIsValidating(false);
        }
    };

    const handleImport = async () => {
        if (!validationResult?.isValid || editedData.length === 0) {
            toast.error('Aucune donnée valide à importer');
            return;
        }

        setIsImporting(true);

        try {
            const response = await fetch(`/api/import/${entityType}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ data: editedData })
            });

            if (!response.ok) {
                throw new Error('Import failed');
            }

            const result = await response.json();
            toast.success(`Import réussi: ${result.created} créé(s), ${result.failed} échec(s)`);

            if (onImportComplete) {
                onImportComplete();
            }

            // Reset
            setFile(null);
            setValidationResult(null);
            setEditedData([]);
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Erreur lors de l\'import des données');
        } finally {
            setIsImporting(false);
        }
    };

    const handleCellEdit = (rowIndex: number, field: string, value: any) => {
        const updated = [...editedData];
        updated[rowIndex][field] = value;
        setEditedData(updated);
    };

    const downloadTemplate = () => {
        // In production, serve actual templates from backend
        toast.info('Téléchargement du template en cours...');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Import {getEntityLabel(entityType)}
                    </h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">
                        Télécharger, valider et importer vos données
                    </p>
                </div>
                <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                    <Download className="h-4 w-4" />
                    Template Excel
                </Button>
            </div>

            {/* Upload Zone */}
            {!file && (
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-[3rem] p-16 text-center cursor-pointer transition-all
                        ${isDragActive
                            ? 'border-drc-blue bg-blue-50'
                            : 'border-slate-200 bg-slate-50/50 hover:border-drc-blue hover:bg-blue-50/30'
                        }
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Upload className="h-10 w-10 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-lg font-black text-slate-900 uppercase">
                                {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez votre fichier'}
                            </p>
                            <p className="text-sm text-slate-400 font-bold mt-2">
                                Ou cliquez pour sélectionner • Excel (.xlsx) ou CSV
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Status */}
            {file && validationResult && (
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
                            <div>
                                <p className="font-black text-slate-900 uppercase text-sm">{file.name}</p>
                                <p className="text-xs text-slate-400 font-bold">
                                    {validationResult.summary.totalRows} lignes • {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setFile(null);
                                setValidationResult(null);
                                setEditedData([]);
                            }}
                        >
                            Annuler
                        </Button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Valides</span>
                            </div>
                            <p className="text-2xl font-black text-emerald-900 font-mono">{validationResult.summary.validRows}</p>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Erreurs</span>
                            </div>
                            <p className="text-2xl font-black text-rose-900 font-mono">{validationResult.errors.length}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Avertissements</span>
                            </div>
                            <p className="text-2xl font-black text-amber-900 font-mono">{validationResult.warnings.length}</p>
                        </div>
                    </div>

                    {/* Errors List */}
                    {validationResult.errors.length > 0 && (
                        <div className="mb-6 p-6 bg-rose-50 rounded-2xl border border-rose-100">
                            <h4 className="font-black text-rose-900 uppercase text-xs tracking-widest mb-4">Liste des erreurs</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {validationResult.errors.slice(0, 10).map((error: ValidationError, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs">
                                        <Badge variant="destructive" className="shrink-0">L{error.row}</Badge>
                                        <span className="font-bold text-rose-900">
                                            {error.field}: {error.message}
                                        </span>
                                    </div>
                                ))}
                                {validationResult.errors.length > 10 && (
                                    <p className="text-xs text-rose-600 font-bold">
                                        ... et {validationResult.errors.length - 10} autres erreurs
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Data Preview Table */}
                    {editedData.length > 0 && (
                        <div className="border border-slate-100 rounded-2xl overflow-hidden">
                            <div className="max-h-96 overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            {Object.keys(editedData[0]).map((key) => (
                                                <TableHead key={key} className="font-black uppercase text-xs">
                                                    {key}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {editedData.slice(0, 50).map((row, rowIdx) => (
                                            <TableRow key={rowIdx}>
                                                {Object.entries(row).map(([key, value]) => (
                                                    <TableCell key={key} className="font-mono text-xs">
                                                        {String(value)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {editedData.length > 50 && (
                                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 font-bold text-center">
                                    Affichage de 50 lignes sur {editedData.length} au total
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <Button
                            onClick={handleImport}
                            disabled={!validationResult.isValid || isImporting || editedData.length === 0}
                            className="flex-1 bg-drc-blue hover:bg-drc-blue/90 font-black uppercase tracking-widest"
                        >
                            {isImporting ? 'Import en cours...' : `Importer ${editedData.length} ligne(s)`}
                        </Button>
                    </div>
                </div>
            )}

            {isValidating && (
                <div className="bg-white p-12 rounded-[3rem] border border-slate-100 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-drc-blue border-r-transparent mb-4"></div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        Validation en cours...
                    </p>
                </div>
            )}
        </div>
    );
}

function getEntityLabel(entityType: EntityType): string {
    const labels: Record<EntityType, string> = {
        employees: 'Employés',
        accounts: 'Plan Comptable',
        companies: 'Entreprises',
        thirdParties: 'Clients/Fournisseurs',
        products: 'Produits'
    };
    return labels[entityType];
}
