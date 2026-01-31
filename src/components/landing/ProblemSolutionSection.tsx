'use client';

import { motion } from 'motion/react';
import { X, CheckCircle2, Zap, TrendingUp } from 'lucide-react';
import { FinancialGrowthIllustration } from './Illustrations';

const problems = [
    "Saisie de factures interminable",
    "Réconciliation bancaire manuelle",
    "Rapports financiers obsolètes",
    "Oublis de déclarations fiscales"
];

const solutions = [
    "Automatisation complète par IA",
    "Synchro bancaire en temps réel",
    "Visions prédictives du cashflow",
    "Conformité fiscale garantie"
];

export function ProblemSolutionSection() {
    return (
        <section className="relative py-40 overflow-hidden bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-24">
                    {/* Illustration Side */}
                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <FinancialGrowthIllustration />

                            {/* Floating Stats */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-emerald-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth</div>
                                        <div className="text-2xl font-black text-gray-900">+124%</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-1/2 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                                Transformez votre<br />
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Flux de Travail.</span>
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                Milele ne se contente pas de compter. Il anticipe, automatise et vous redonne le temps que vous méritez.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="h-4 w-4 bg-red-100 rounded-full flex items-center justify-center">
                                        <X className="h-3 w-3 text-red-600" />
                                    </span>
                                    Le Chaos Manuel
                                </h3>
                                <div className="space-y-4">
                                    {problems.map((problem, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-3 text-gray-500 text-sm"
                                        >
                                            <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                            {problem}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="h-4 w-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Zap className="h-3 w-3 text-emerald-600" />
                                    </span>
                                    L'Expérience Milele
                                </h3>
                                <div className="space-y-4">
                                    {solutions.map((solution, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className="flex items-center gap-3 text-gray-900 font-bold text-sm"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            {solution}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
