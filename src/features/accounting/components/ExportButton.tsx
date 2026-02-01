'use client';

import React from 'react';
import { Download, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export type ReportType =
    | 'balance-sheet'
    | 'profit-loss'
    | 'trial-balance'
    | 'cash-flow'
    | 'vat' | 'balance-6-columns';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ExportButtonProps {
    reportType: ReportType;
    fiscalYearId: number;
    label?: string;
}

export function ExportButton({ reportType, fiscalYearId, label = 'Exporter' }: ExportButtonProps) {
    const [isExporting, setIsExporting] = React.useState(false);

    const handleExport = async (format: ExportFormat) => {
        setIsExporting(true);

        try {
            const response = await fetch(
                `/api/accounting/reports/export/${reportType}/${format}/${fiscalYearId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : `export_${reportType}_${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`Rapport exporté avec succès en ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Erreur lors de l\'export du rapport');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isExporting}
                    className="gap-2"
                >
                    <Download className="h-4 w-4" />
                    {isExporting ? 'Export en cours...' : label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
                    <FileCode className="h-4 w-4 text-blue-500" />
                    Export CSV
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
