'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ExcelImportButtonProps<T> {
    onImport: (data: T[]) => void;
    templateData?: any[];
    fileName?: string;
    label?: string;
    isLoading?: boolean;
}

export function ExcelImportButton<T>({
    onImport,
    templateData,
    fileName = 'template.xlsx',
    label = 'Importer Excel',
    isLoading = false
}: ExcelImportButtonProps<T>) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws) as T[];

                if (data.length === 0) {
                    toast.error('Le fichier est vide');
                    return;
                }

                onImport(data);
                toast.success(`${data.length} lignes importées avec succès`);

                // Clear input
                if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (error) {
                console.error('Excel Import Error:', error);
                toast.error('Erreur lors de la lecture du fichier Excel');
            }
        };
        reader.readAsBinaryString(file);
    };

    const downloadTemplate = () => {
        if (!templateData) return;
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                className="hidden"
            />
            <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-10 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-xs gap-2"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-drc-blue" />}
                {label}
            </Button>

            {templateData && (
                <Button
                    variant="ghost"
                    onClick={downloadTemplate}
                    className="h-10 w-10 p-0 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-drc-blue"
                    title="Télécharger le modèle"
                >
                    <FileSpreadsheet className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
