'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

function PricingCard({ tier, price, desc, features, isPopular, color = 'drc-blue' }: { tier: string, price: string, desc: string, features: string[], isPopular?: boolean, color?: string }) {
    const colorMap: Record<string, string> = {
        'drc-blue': 'bg-drc-blue hover:bg-blue-700 shadow-blue-500/20',
        'drc-yellow': 'bg-drc-yellow hover:bg-yellow-500 text-yellow-900 shadow-yellow-500/20',
        'drc-red': 'bg-drc-red hover:bg-red-700 shadow-red-500/20',
    };

    return (
        <div className={`p-12 rounded-[3.5rem] border flex flex-col relative overflow-hidden transition-all duration-700 hover:-translate-y-3 ${isPopular ? 'bg-white border-drc-blue shadow-[0_50px_100px_-20px_rgba(0,119,200,0.15)] z-10 scale-105' : 'bg-white border-slate-100 shadow-xl shadow-slate-500/[0.02] hover:border-slate-200'}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 bg-drc-blue text-white text-[10px] font-black px-6 py-2.5 rounded-bl-3xl uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    RECOMMANDÉ
                </div>
            )}
            <div className="mb-12">
                <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isPopular ? 'text-drc-blue' : 'text-slate-400'}`}>{tier}</h3>
                <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-black font-outfit ${isPopular ? 'text-slate-950' : 'text-slate-900'}`}>{price}</span>
                    {price !== 'Sur Mesure' && <span className="text-slate-400 font-bold text-sm tracking-tight uppercase">/mois</span>}
                </div>
                <p className="text-slate-500 mt-6 text-base font-medium leading-relaxed">{desc}</p>
            </div>
            <div className="flex-1 space-y-6 mb-12">
                {features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-xl ${isPopular ? 'bg-blue-50 text-drc-blue' : 'bg-slate-50 text-slate-400'}`}>
                            <Check className="h-4 w-4 stroke-[4]" />
                        </div>
                        {feat}
                    </div>
                ))}
            </div>
            <Button asChild className={`w-full h-16 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${isPopular ? `${colorMap[color]} text-white shadow-2xl` : 'bg-slate-950 hover:bg-slate-800 text-white shadow-lg shadow-slate-950/20'}`}>
                <Link href="/register">ESSAYER GRATUITEMENT</Link>
            </Button>

            {/* Subtle bottom accent */}
            <div className={`absolute bottom-0 left-0 h-1.5 w-full ${isPopular ? 'bg-drc-blue' : 'bg-transparent'}`} />
        </div>
    )
}

export function PricingSection() {
    return (
        <section id="pricing" className="py-40 px-6 relative bg-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-32">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black mb-8 uppercase tracking-[0.2em] font-outfit">
                        OFFRES SANS ENGAGEMENT
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black mb-8 text-slate-950 font-outfit uppercase tracking-tighter leading-[0.95]">
                        INVESTISSEZ DANS
                        <br />
                        <span className="text-drc-blue">VOTRE PERFORMANCE.</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">Des forfaits transparents, payables en USD ou CDF, conçus pour la réalité économique de la RDC.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto items-center">
                    {/* STARTER */}
                    <PricingCard
                        tier="Indépendant"
                        price="$29"
                        desc="Solution parfaite pour les consultants, freelances et startups locales."
                        features={['1 Expert Utilisateur', 'Facturation Illimitée DGI', 'Journal de Caisse/Banque', 'Export PDF SYSCOHADA', 'Support WhatsApp Kinshasa']}
                    />
                    {/* PRO */}
                    <PricingCard
                        tier="PME Expansion"
                        price="$79"
                        desc="Le moteur de croissance pour les entreprises structurées en RDC."
                        features={['5 Utilisateurs Inclus', 'Comptabilité Générale & Tiers', 'Gestion de Production & Stock', 'Saisie par l\'IA Milele', 'Support Technique Prioritaire']}
                        isPopular
                    />
                    {/* ENTERPRISE */}
                    <PricingCard
                        tier="Corporate"
                        price="Sur Mesure"
                        desc="Infrastructures dédiées pour les grands comptes et organisations complexes."
                        features={['Utilisateurs Illimités', 'Gouvernance & Audit Logs', 'Accompagnement Déploiement', 'Formation des Equipes', 'Service On-Premise (Local)']}
                    />
                </div>
            </div>
        </section>
    );
}
