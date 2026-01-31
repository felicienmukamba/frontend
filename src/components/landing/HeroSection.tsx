'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, CheckCircle2, Globe, Laptop, Smartphone, Monitor, Cpu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            {/* Background Decorative Element (DRC styled) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-drc-blue/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Column: Text */}
                <div className="relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-[10px] font-black mb-10 uppercase tracking-[0.2em] font-outfit">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-3 bg-drc-blue rounded-sm" />
                                <div className="h-2 w-3 bg-drc-yellow rounded-sm" />
                                <div className="h-2 w-3 bg-drc-red rounded-sm" />
                            </div>
                            <span className="text-slate-500">Certifié DGI & OHADA</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.95] text-slate-950 font-outfit uppercase">
                            LE FUTUR DE LA
                            <br />
                            <span className="text-drc-blue">GESTION EN RDC.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-500 mb-12 max-w-xl leading-relaxed font-medium">
                            Milele automatise votre comptabilité <span className="text-slate-900 font-bold italic">OHADA</span>, vos factures normalisées <span className="text-slate-900 font-bold italic">DGI</span> et votre production. Conçu par des experts pour les leaders congolais.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6 mb-16">
                            <Button asChild className="w-full sm:w-auto h-20 px-12 rounded-[2rem] bg-drc-blue hover:bg-blue-700 text-white text-xl font-black tracking-tight shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 group">
                                <Link href="/contact">
                                    Démarrer gratuitement
                                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                <div className="text-left">
                                    <div className="text-xs font-black text-slate-900 uppercase">100% SÉCURISÉ</div>
                                    <div className="text-[10px] font-bold text-slate-400">Données cryptées & souveraines</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Available For Icons */}
                        <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-10 border-t border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">PLATFORMES SUPPORTÉES</span>
                            <div className="flex gap-6 text-slate-300">
                                <div title="Web & Cloud" className="hover:text-drc-blue transition-colors cursor-help"><Globe className="h-6 w-6" /></div>
                                <div title="Desktop (Offline sync)" className="hover:text-drc-blue transition-colors cursor-help"><Monitor className="h-6 w-6" /></div>
                                <div title="Mobile App" className="hover:text-drc-blue transition-colors cursor-help"><Smartphone className="h-6 w-6" /></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Column: Illustrative Focal Element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative hidden lg:block"
                >
                    <div className="relative z-10 p-1 bg-gradient-to-br from-white via-white to-drc-blue/20 rounded-[4rem] border border-white shadow-2xl overflow-hidden aspect-square flex items-center justify-center group overflow-visible">
                        {/* Background mesh for intensity */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.1)_0,transparent_60%)]" />

                        {/* Main Focal Mockup */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-20 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] p-0 border border-slate-100 w-[95%] aspect-[4/3] overflow-hidden"
                        >
                            {/* Browser Header */}
                            <div className="h-12 bg-slate-50 flex items-center gap-2 px-6 border-b border-slate-100">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-drc-red" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-drc-yellow" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                </div>
                                <div className="ml-6 h-5 w-48 bg-white rounded-lg border border-slate-100 shadow-sm" />
                            </div>
                            {/* Dashboard Simulation */}
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="h-6 w-32 bg-slate-100/50 rounded-full" />
                                        <div className="h-12 w-full bg-blue-50/50 rounded-2xl border border-blue-100" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-6 w-32 bg-slate-100/50 rounded-full" />
                                        <div className="h-12 w-full bg-emerald-50/50 rounded-2xl border border-emerald-100" />
                                    </div>
                                </div>
                                <div className="h-48 w-full bg-slate-50/80 rounded-3xl border border-slate-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-drc-blue/5 via-transparent to-transparent" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating elements with DRC identity - Financial Element REMOVED */}
                        <motion.div
                            animate={{ x: [0, -15, 0], y: [0, -20, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-5 -left-10 z-30 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-4"
                        >
                            <div className="h-12 w-12 rounded-xl bg-drc-red/10 flex items-center justify-center">
                                <Cpu className="h-6 w-6 text-drc-red" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase">DGI Sync</div>
                                <div className="text-sm font-black text-emerald-600">SCELLÉ & VALIDÉ</div>
                            </div>
                        </motion.div>

                        {/* Background Shapes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 animate-spin-slow">
                            <svg viewBox="0 0 100 100" className="opacity-[0.03] text-drc-blue w-full h-full">
                                <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div >
        </section >
    );
}
