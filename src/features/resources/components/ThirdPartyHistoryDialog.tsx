'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    PremiumTable,
    PremiumTableBody,
    PremiumTableCell,
    PremiumTableHead,
    PremiumTableHeader,
    PremiumTableRow,
    BadgeDRC
} from '@/components/ui/PremiumTable';
import { useGetThirdPartyHistoryQuery } from '../api/resourcesApi';
import { Loader2, FileText, ShoppingCart, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ThirdPartyHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    thirdPartyId: number | null;
}

export function ThirdPartyHistoryDialog({ open, onOpenChange, thirdPartyId }: ThirdPartyHistoryDialogProps) {
    const { data, isLoading, error } = useGetThirdPartyHistoryQuery(thirdPartyId || 0, {
        skip: !thirdPartyId,
    });

    const transactions = data?.transactions || [];
    const type = data?.type;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[800px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                                <FileText className="h-5 w-5 text-drc-blue" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dossier Partenaire</span>
                        </div>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tight">
                            HISTORIQUE DES OPÉRATIONS
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Consultation des mouvements et documents liés.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 bg-slate-50 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-drc-blue" />
                            <p className="text-sm font-medium text-slate-500">Chargement de l'historique...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                            <AlertCircle className="h-8 w-8" />
                            <p className="text-sm font-bold">Impossible de charger l'historique.</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-400">
                            <div className="bg-white p-4 rounded-full shadow-sm">
                                <FileText className="h-8 w-8 opacity-20" />
                            </div>
                            <p className="text-sm font-medium">Aucune opération trouvée pour ce tiers.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                            <PremiumTable>
                                <PremiumTableHeader>
                                    <PremiumTableRow className="bg-slate-50/50">
                                        <PremiumTableHead>Date</PremiumTableHead>
                                        <PremiumTableHead>Référence</PremiumTableHead>
                                        <PremiumTableHead>Type</PremiumTableHead>
                                        <PremiumTableHead>Montant</PremiumTableHead>
                                        <PremiumTableHead className="text-right">Statut</PremiumTableHead>
                                    </PremiumTableRow>
                                </PremiumTableHeader>
                                <PremiumTableBody>
                                    {transactions.map((tx: any) => (
                                        <PremiumTableRow key={`${tx.type}-${tx.id}`} className="hover:bg-slate-50/50 transition-colors">
                                            <PremiumTableCell className="font-medium text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    {format(new Date(tx.date), 'dd/MM/yyyy', { locale: fr })}
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <span className="font-mono font-bold text-slate-700">{tx.reference}</span>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                {tx.type === 'INVOICE' ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wide">
                                                        <FileText className="h-3 w-3" /> Facture
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wide">
                                                        <ShoppingCart className="h-3 w-3" /> Achat
                                                    </div>
                                                )}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="font-black font-mono text-slate-700">
                                                {new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'USD' }).format(Number(tx.amount))}
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right">
                                                <BadgeDRC variant={
                                                    tx.status === 'PAID' || tx.status === 'RECEIVED' ? 'green' :
                                                        tx.status === 'VALIDATED' ? 'blue' :
                                                            tx.status === 'DRAFT' ? 'slate' : 'red'
                                                }>
                                                    {tx.status}
                                                </BadgeDRC>
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    ))}
                                </PremiumTableBody>
                            </PremiumTable>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
