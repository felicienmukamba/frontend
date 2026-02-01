'use client';

import React, { useState } from 'react';
import { useGetTrainingsQuery, useGetTrainingDomainsQuery } from '../api/hrApi';
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
import { CardDRC } from '@/components/ui/card';
import {
    GraduationCap,
    Plus,
    Calendar,
    MapPin,
    BookOpen,
    Users,
    Search,
    Video
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { TrainingDialog } from './TrainingDialog';

export const TrainingList = () => {
    const { data: trainings, isLoading: loadingTrainings } = useGetTrainingsQuery();
    const { data: domains, isLoading: loadingDomains } = useGetTrainingDomainsQuery();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState('');

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'PLANNED':
                return "blue";
            case 'IN_PROGRESS':
                return "yellow";
            case 'COMPLETED':
                return "green";
            case 'CANCELLED':
                return "red";
            default:
                return "slate";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PLANNED': return 'Planifié';
            case 'IN_PROGRESS': return 'En cours';
            case 'COMPLETED': return 'Terminé';
            case 'CANCELLED': return 'Annulé';
            default: return status;
        }
    };

    // Filter logic if needed
    const filteredTrainings = trainings?.filter((t: any) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loadingTrainings || loadingDomains) return <div className="p-8 text-center text-slate-500">Chargement des données...</div>;

    return (
        <div className="space-y-6">
            <TrainingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                        Développement Compétences
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit uppercase">Formation Continue</h2>
                    <p className="text-slate-500 font-medium mt-1">Gérez le plan de formation et les sessions d'apprentissage.</p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-drc-blue hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus className="mr-2 h-5 w-5" /> Programmer une Session
                </Button>
            </div>

            <Tabs defaultValue="sessions" className="space-y-6">
                <TabsList className="bg-slate-100 p-1 rounded-xl w-auto inline-flex">
                    <TabsTrigger value="sessions" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-drc-blue data-[state=active]:shadow-sm font-bold transition-all">Sessions</TabsTrigger>
                    <TabsTrigger value="domains" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-drc-blue data-[state=active]:shadow-sm font-bold transition-all">Domaines</TabsTrigger>
                </TabsList>

                <TabsContent value="sessions" className="space-y-4">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 py-2 mb-4">
                            <div className="relative flex-1 max-w-sm group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-drc-blue transition-colors" />
                                <Input
                                    placeholder="Rechercher une formation..."
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
                                        <PremiumTableHead>Formation</PremiumTableHead>
                                        <PremiumTableHead>Date & Lieu</PremiumTableHead>
                                        <PremiumTableHead>Formateur</PremiumTableHead>
                                        <PremiumTableHead>Statut</PremiumTableHead>
                                        <PremiumTableHead className="text-right">Actions</PremiumTableHead>
                                    </PremiumTableRow>
                                </PremiumTableHeader>
                                <PremiumTableBody>
                                    {filteredTrainings?.map((training: any) => (
                                        <PremiumTableRow key={training.id} className="hover:bg-slate-50/50 transition-colors">
                                            <PremiumTableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                                                        <GraduationCap className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 uppercase">{training.title}</div>
                                                        <div className="text-xs font-semibold text-slate-400">{training.domain?.name}</div>
                                                    </div>
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                        <Calendar className="h-3 w-3 text-slate-400" />
                                                        {format(new Date(training.startDate), 'dd MMM yyyy', { locale: fr })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                        <MapPin className="h-3 w-3 text-slate-400" />
                                                        {training.location || 'Local'}
                                                    </div>
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <Users className="h-4 w-4 text-slate-400" />
                                                    {training.trainer || 'Non assigné'}
                                                </div>
                                            </PremiumTableCell>
                                            <PremiumTableCell>
                                                <BadgeDRC variant={getStatusVariant(training.status)}>
                                                    {getStatusLabel(training.status)}
                                                </BadgeDRC>
                                            </PremiumTableCell>
                                            <PremiumTableCell className="text-right">
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-drc-blue hover:bg-blue-50">
                                                    <Video className="h-4 w-4" />
                                                </Button>
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    ))}
                                    {filteredTrainings?.length === 0 && (
                                        <PremiumTableRow>
                                            <PremiumTableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                                                Aucune formation trouvée.
                                            </PremiumTableCell>
                                        </PremiumTableRow>
                                    )}
                                </PremiumTableBody>
                            </PremiumTable>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="domains">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Catalogue des Domaines</h3>
                            <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold">
                                <Plus className="h-4 w-4 mr-2" /> Nouveau Domaine
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {domains?.map((domain: any) => (
                                <CardDRC key={domain.id} className="p-4 hover:shadow-md transition-all border-slate-100 bg-slate-50/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                            <BookOpen className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="font-bold text-slate-900">{domain.name}</div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {domain.description || 'Aucune description disponible pour ce domaine de formation.'}
                                    </p>
                                </CardDRC>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
