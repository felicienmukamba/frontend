'use client';

import React from 'react';
import { Scale, FileCheck, ShieldCheck, Lock } from 'lucide-react';

export function SecuritySection() {
    return (
        <section id="security" className="py-32 px-6 bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-drc-blue/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
                <div className="order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black mb-8 uppercase tracking-[0.2em] font-outfit">
                        SOUVERAINETÉ & CONFORMITÉ
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-8 leading-[0.95] text-slate-950 font-outfit uppercase">
                        VOTRE FORTERESSE
                        <br />
                        <span className="text-drc-blue">NUMÉRIQUE.</span>
                    </h2>
                    <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">
                        Milele protège le cœur de votre entreprise avec des standards de sécurité de classe mondiale, garantissant la souveraineté de vos données financières en RDC.
                    </p>

                    <div className="space-y-10">
                        <div className="flex gap-6 group">
                            <div className="mt-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit transition-all group-hover:bg-drc-blue group-hover:border-drc-blue group-hover:text-white group-hover:shadow-blue-500/25 group-hover:-translate-y-1 duration-500 text-drc-blue">
                                <Scale className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 font-outfit uppercase tracking-tight">Souveraineté des Données</h3>
                                <p className="text-slate-500 text-base leading-relaxed font-medium">Vos serveurs sont optimisés pour une latence minimale en Afrique Centrale, avec un respect strict des lois congolaises sur la protection des données.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 group">
                            <div className="mt-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit transition-all group-hover:bg-drc-yellow group-hover:border-drc-yellow group-hover:text-yellow-900 group-hover:shadow-yellow-500/25 group-hover:-translate-y-1 duration-500 text-yellow-600">
                                <FileCheck className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 font-outfit uppercase tracking-tight">Standard SYSCOHADA</h3>
                                <p className="text-slate-500 text-base leading-relaxed font-medium">Liasses fiscales, TAFIRE et Etats Financiers OHADA révisés générés nativement. Aucune erreur humaine possible.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 group">
                            <div className="mt-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-fit transition-all group-hover:bg-drc-red group-hover:border-drc-red group-hover:text-white group-hover:shadow-red-500/25 group-hover:-translate-y-1 duration-500 text-drc-red">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 font-outfit uppercase tracking-tight">Certification DGI RDC</h3>
                                <p className="text-slate-500 text-base leading-relaxed font-medium">Intégration native avec les systèmes de la DGI pour la facturation normalisée et la sécurisation des flux de TVA.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 relative px-4 sm:px-0">
                    <div className="absolute inset-0 bg-drc-blue/5 rounded-[4rem] blur-[100px]" />
                    <div className="relative bg-white border border-slate-100 rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] scale-105">
                        <div className="flex items-center justify-between mb-12 border-b border-slate-50 pb-10">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-drc-red shadow-lg shadow-red-500/30" />
                                <div className="h-3 w-3 rounded-full bg-drc-yellow shadow-lg shadow-yellow-500/30" />
                                <div className="h-3 w-3 rounded-full bg-drc-blue shadow-lg shadow-blue-500/30" />
                            </div>
                            <div className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] font-mono">MILELE_KERNEL_LOGS</div>
                        </div>
                        <div className="space-y-8 font-mono text-xs">
                            <div className="flex gap-5 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/30">
                                <span className="text-emerald-500 font-bold">14:22:01</span>
                                <span className="text-emerald-700 font-black">ENCRYPTED</span>
                                <span className="text-slate-600 font-medium tracking-tight">DGI_GATEWAY: Connection established</span>
                            </div>
                            <div className="flex gap-5 p-4 rounded-2xl bg-blue-50/40 border border-blue-100/30">
                                <span className="text-drc-blue font-bold">14:22:05</span>
                                <span className="text-blue-700 font-black">OHADA_V3</span>
                                <span className="text-slate-600 font-medium tracking-tight">LEDGER: Entity isolation verified</span>
                            </div>
                            <div className="flex gap-5 p-4 rounded-2xl bg-yellow-50/40 border border-yellow-100/30">
                                <span className="text-yellow-600 font-bold">14:25:30</span>
                                <span className="text-yellow-700 font-black">SOVEREIGN</span>
                                <span className="text-slate-600 font-medium tracking-tight">STORAGE: Data residency LUBUMBASHI_DC</span>
                            </div>
                            <div className="flex gap-5 p-4 rounded-2xl bg-slate-50/50 opacity-40">
                                <span className="text-slate-400 font-bold">14:30:00</span>
                                <span className="text-slate-500 font-black">BAKCUP</span>
                                <span className="text-slate-400 font-medium tracking-tight">MIRROR: Cloud synchronization complete</span>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 rounded-xl">
                                    <Lock className="h-5 w-5 text-emerald-600" />
                                </div>
                                <span className="text-emerald-700 font-black text-xs tracking-wider uppercase">Vault Active</span>
                            </div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">Certificat RDC-PKI</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
