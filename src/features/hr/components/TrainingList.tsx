'use client';

import React from 'react';
import { useGetTrainingsQuery, useGetTrainingDomainsQuery } from '../api/hrApi';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    GraduationCap,
    Plus,
    Calendar,
    MapPin,
    BookOpen,
    Users
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { TrainingDialog } from './TrainingDialog';

export const TrainingList = () => {
    const { data: trainings, isLoading: loadingTrainings } = useGetTrainingsQuery();
    const { data: domains, isLoading: loadingDomains } = useGetTrainingDomainsQuery();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'PLANNED':
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Planifié</Badge>;
            case 'IN_PROGRESS':
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">En cours</Badge>;
            case 'COMPLETED':
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Terminé</Badge>;
            case 'CANCELLED':
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Annulé</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loadingTrainings || loadingDomains) return <div className="p-8 text-center text-slate-500">Chargement des données...</div>;

    return (
        <Tabs defaultValue="sessions" className="space-y-6">
            <TrainingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="flex justify-between items-center">
                <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="sessions" className="rounded-lg px-6 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all">Sessions</TabsTrigger>
                    <TabsTrigger value="domains" className="rounded-lg px-6 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all">Domaines</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="sessions" className="space-y-4">
                <Card className="border-slate-800/40 bg-slate-900/50 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xl font-bold text-white">Sessions de Formation</CardTitle>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Programmer une Session
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trainings?.map((training: any) => (
                                <Card key={training.id} className="bg-slate-800/20 border-slate-700/50 hover:bg-slate-800/40 transition-all group">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{training.title}</h3>
                                                <p className="text-sm text-slate-400 font-medium">{training.domain?.name || 'Domaine Général'}</p>
                                            </div>
                                            {getStatusVariant(training.status)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Calendar className="h-3.5 w-3.5 text-purple-500" />
                                                <span>{format(new Date(training.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <MapPin className="h-3.5 w-3.5 text-purple-500" />
                                                <span>{training.location || 'Bureau'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Users className="h-3.5 w-3.5 text-purple-500" />
                                                <span>Formateur: {training.trainer || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-800/60 flex justify-between items-center">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="h-7 w-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                                                        U{i}
                                                    </div>
                                                ))}
                                                <div className="h-7 w-7 rounded-full bg-purple-500/20 border-2 border-slate-900 flex items-center justify-center text-[10px] text-purple-400 font-bold">
                                                    +5
                                                </div>
                                            </div>
                                            <Button variant="link" className="text-purple-400 hover:text-purple-300 h-auto p-0 text-xs">
                                                Voir les participants
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {trainings?.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-500">
                                    Aucune formation programmée.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="domains">
                <Card className="border-slate-800/40 bg-slate-900/50 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-white">Domaines de Formation</CardTitle>
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un Domaine
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Nom du Domaine</TableHead>
                                    <TableHead className="text-slate-400">Description</TableHead>
                                    <TableHead className="text-right text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains?.map((domain: any) => (
                                    <TableRow key={domain.id} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="font-medium text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-500/10 p-2 rounded-lg">
                                                    <BookOpen className="h-4 w-4 text-purple-400" />
                                                </div>
                                                {domain.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm">
                                            {domain.description || 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                                                Gérer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {domains?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-12 text-center text-slate-500 border-slate-800">
                                            Aucun domaine enregistré.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};
