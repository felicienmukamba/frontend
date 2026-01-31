'use client';

import React from 'react';
import { ShieldCheck, LayoutGrid, Globe, Terminal } from 'lucide-react';

function BentoCard({ title, desc, icon, gradient }: { title: string, desc: string, icon: React.ReactNode, gradient: string }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-drc-blue/30 transition-all group relative overflow-hidden shadow-xl shadow-blue-500/[0.02] hover:shadow-2xl hover:shadow-blue-500/[0.05]">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="relative z-10">
                <div className="mb-8 p-5 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all duration-500 border border-slate-100 group-hover:border-drc-blue/10">
                    {icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-950 font-outfit uppercase tracking-tight">{title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{desc}</p>
            </div>
            {/* Subtle DRC accent line on hover */}
            <div className="absolute bottom-0 left-0 h-1 bg-drc-blue w-0 group-hover:w-full transition-all duration-700" />
        </div>
    );
}

export function FeaturesSection() {
    return (
        <section id="features" className="py-32 px-6 relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
                        PUISSANCE & CONFORMITÉ
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-950 font-outfit uppercase tracking-tighter">UNE ARCHITECTURE <span className="text-drc-blue">MODULAIRE.</span></h2>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">Milele est conçu pour s'adapter à la réalité des entreprises congolaises, de la PME locale au grand groupe minier.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <BentoCard
                        title="Conformité RDC"
                        desc="Factures normalisées scellées DGI et liasse fiscale OHADA générée en un clic."
                        icon={<ShieldCheck className="text-drc-blue h-7 w-7" />}
                        gradient="from-blue-50/40 to-transparent"
                    />
                    <BentoCard
                        title="Finance Congolaise"
                        desc="Multi-devises (CDF/USD), gestion de la TVA locale et rapports de trésorerie prédictifs."
                        icon={<LayoutGrid className="text-yellow-600 h-7 w-7" />}
                        gradient="from-yellow-50/40 to-transparent"
                    />
                    <BentoCard
                        title="Intelligence Locale"
                        desc="Gestion des filiales, des succursales et consolidation automatique OHADA en temps réel."
                        icon={<Globe className="text-blue-500 h-7 w-7" />}
                        gradient="from-blue-50/40 to-transparent"
                    />
                    <BentoCard
                        title="Ecosystème"
                        desc="Connectez vos banques, CRM et outils via notre API sécurisée pour une scalabilité infinie."
                        icon={<Terminal className="text-slate-600 h-7 w-7" />}
                        gradient="from-slate-50/40 to-transparent"
                    />
                </div>
            </div>
        </section>
    );
}
