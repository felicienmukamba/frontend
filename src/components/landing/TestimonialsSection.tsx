'use client';

import React from 'react';
import { Quote } from 'lucide-react';

function TestimonialCard({ quote, author, role, company }: { quote: string, author: string, role: string, company: string }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-indigo-50 relative group transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100">
            <Quote className="absolute top-8 right-10 h-10 w-10 text-indigo-500/5 group-hover:text-blue-500/10 transition-colors" />
            <p className="text-slate-600 mb-10 italic leading-relaxed font-medium text-lg">"{quote}"</p>
            <div className="flex items-center gap-4 border-t border-indigo-50 pt-8">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20" />
                <div>
                    <div className="text-sm font-black text-slate-900 uppercase tracking-wide">{author}</div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5">{role}, <span className="text-blue-600">{company}</span></div>
                </div>
            </div>
        </div>
    )
}

export function TestimonialsSection() {
    return (
        <section className="py-32 px-6 bg-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-3 gap-10">
                    <TestimonialCard
                        quote="Le module DGI RDC est une révolution. Nous avons divisé par 4 le temps passé sur nos déclarations mensuelles."
                        author="Ferdinand K."
                        role="Directeur Financier"
                        company="Kivu Resources"
                    />
                    <TestimonialCard
                        quote="Enfin un ERP qui comprend les spécificités OHADA sans avoir besoin d'une armée de consultants pour le configurer."
                        author="Aminata T."
                        role="Expert Comptable"
                        company="AT Consulting"
                    />
                    <TestimonialCard
                        quote="La visibilité en temps réel sur la trésorerie de nos 5 filiales est devenue notre outil de pilotage numéro 1."
                        author="Marc O."
                        role="CEO"
                        company="Horizon Holdings"
                    />
                </div>
            </div>
        </section>
    );
}
