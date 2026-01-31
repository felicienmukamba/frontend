'use client';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { GuestGuard } from '@/features/auth/components/GuestGuard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
    return (
        <GuestGuard>
            <div className="relative min-h-screen bg-white overflow-hidden flex flex-col lg:flex-row">
                {/* Left Side: Branding & Intensity (60% on large screens) */}
                <div className="relative lg:w-[60%] bg-slate-950 flex flex-col justify-between p-8 md:p-16 lg:p-24 overflow-hidden">
                    {/* Background Decorative Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-drc-blue/10 to-transparent" />

                    {/* Top: Logo & Back */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col gap-12"
                    >
                        <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">Retour au site</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-2xl">
                                <Image src="/icon.png" alt="Milele" width={32} height={32} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter font-outfit uppercase">MILELE AS</span>
                                <div className="flex gap-1 mt-1">
                                    <div className="h-1 w-2.5 bg-drc-blue rounded-full" />
                                    <div className="h-1 w-2.5 bg-drc-yellow rounded-full" />
                                    <div className="h-1 w-2.5 bg-drc-red rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Middle: Value Prop */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 max-w-xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-drc-blue text-[10px] font-black mb-8 uppercase tracking-[0.2em] font-outfit">
                            <div className="h-1.5 w-1.5 rounded-full bg-drc-blue animate-pulse" />
                            Certifié DGI & OHADA
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8 font-outfit uppercase">
                            PILOTEZ VOTRE
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-drc-blue via-blue-400 to-indigo-400">CROISSANCE LÉGALE.</span>
                        </h1>
                        <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium">
                            Rejoignez l'élite des entreprises congolaises qui automatisent leur gestion avec Milele. Sécurisé, souverain et précis.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <ShieldCheck className="h-6 w-6 text-drc-blue" />
                                <h3 className="text-white font-bold text-sm uppercase tracking-tight">Conformité RDC</h3>
                                <p className="text-slate-500 text-xs leading-normal">Facturation DGI et liasses OHADA sans erreur.</p>
                            </div>
                            <div className="space-y-3">
                                <Zap className="h-6 w-6 text-drc-yellow" />
                                <h3 className="text-white font-bold text-sm uppercase tracking-tight">Vitesse IA</h3>
                                <p className="text-slate-500 text-xs leading-normal">Automatisation complète de la saisie comptable.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom: Footer Info */}
                    <div className="relative z-10 hidden lg:flex items-center gap-8 pt-12 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>© 2026 Milele Accounting Software</span>
                        <div className="flex gap-4">
                            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Confidentialité</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form (40% on large screens) */}
                <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 md:p-16 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <div className="mb-12">
                            <h2 className="text-4xl font-black text-slate-950 font-outfit uppercase tracking-tighter mb-3">CONFORMITÉ ACTIVE.</h2>
                            <p className="text-slate-500 font-medium">Entrez vos accès pour piloter votre organisation.</p>
                        </div>

                        <LoginForm />

                        <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                            <p className="text-sm font-medium text-slate-500 mb-4">
                                Nouveau sur la plateforme ?
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center w-full h-14 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                            >
                                Créer mon compte certifié
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </GuestGuard>
    );
}
