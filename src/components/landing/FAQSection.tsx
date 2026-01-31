'use client';

import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Milele est-il conforme au SYSCOHADA révisé ?",
        answer: "Oui, absolument. Le moteur de Milele est conçu nativement pour respecter les normes OHADA les plus récentes, incluant la génération automatique du bilan, du compte de résultat et du TAFIRE."
    },
    {
        question: "Comment se passe l'intégration avec la DGI en RDC ?",
        answer: "Nous sommes intégrés nativement avec les systèmes de facturation normalisée. Milele génère des signatures électroniques certifiées et assure que vos déclarations de TVA sont conformes aux exigences de la DGI."
    },
    {
        question: "Peut-on gérer plusieurs succursales à Kinshasa et en province ?",
        answer: "Oui, Milele permet une gestion multi-sites avec consolidation automatique. Vous pouvez piloter vos activités à Lubumbashi, Goma ou Matadi depuis votre tableau de bord central à Kinshasa."
    },
    {
        question: "Les données sont-elles accessibles sans connexion internet ?",
        answer: "Bien que Milele soit une solution Cloud, nous disposons d'un mode de synchronisation intelligent qui permet de continuer la facturation en cas de coupure internet temporaire."
    }
];

export function FAQSection() {
    return (
        <section id="faq" className="py-40 px-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-drc-blue/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black mb-8 uppercase tracking-[0.2em] font-outfit">
                        QUESTIONS FRÉQUENTES
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-950 font-outfit uppercase tracking-tighter">VOUS AVEZ DES <span className="text-drc-blue">QUESTIONS ?</span></h2>
                    <p className="text-slate-500 font-medium text-xl">Tout ce que vous devez savoir sur la puissance du système Milele en RDC.</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-6">
                    {faqs.map((faq, i) => (
                        <AccordionItem
                            key={i}
                            value={`item-${i}`}
                            className="border border-slate-100 bg-white rounded-[2rem] px-8 transition-all hover:bg-slate-50/50 hover:border-drc-blue/20 hover:shadow-2xl hover:shadow-blue-500/[0.03] overflow-hidden"
                        >
                            <AccordionTrigger className="text-left text-slate-950 font-black text-lg hover:text-drc-blue py-8 no-underline hover:no-underline transition-all font-outfit uppercase tracking-tight">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-500 pb-10 text-base leading-relaxed font-medium">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Subtle DRC flag accent at the bottom of the section */}
                <div className="mt-20 flex justify-center gap-3 opacity-30">
                    <div className="h-1.5 w-6 bg-drc-blue rounded-full" />
                    <div className="h-1.5 w-6 bg-drc-yellow rounded-full" />
                    <div className="h-1.5 w-6 bg-drc-red rounded-full" />
                </div>
            </div>
        </section>
    );
}
