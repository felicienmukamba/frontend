'use client';

import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function ForgotPasswordPage() {
    return (
        <div className="relative min-h-screen bg-white overflow-hidden flex flex-col lg:flex-row">
            {/* Left Side: Branding & Intensity (60% on large screens) */}
            <div className="relative lg:w-[60%] bg-slate-950 flex flex-col justify-between p-8 md:p-16 lg:p-24 overflow-hidden">
                {/* Background Decorative Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,119,200,0.15)_0,transparent_70%)] opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-drc-red/10 to-transparent" />

                {/* Top: Logo & Back */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col gap-12"
                >
                    <Link href="/login" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Retour à la connexion</span>
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-drc-red text-[10px] font-black mb-8 uppercase tracking-[0.2em] font-outfit">
                        <div className="h-1.5 w-1.5 rounded-full bg-drc-red animate-pulse" />
                        ZONE SÉCURISÉE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-8 font-outfit uppercase">
                        RÉCUPÉREZ VOTRE
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-drc-red via-red-400 to-orange-400">ACCÈS.</span>
                    </h1>
                    <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium">
                        La souveraineté de vos données commence par un accès protégé. Suivez les instructions pour réinitialiser votre compte en toute sécurité.
                    </p>

                    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <ShieldAlert className="h-6 w-6 text-drc-red flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-tight mb-1">Processus Vérifié</h3>
                            <p className="text-slate-500 text-xs leading-normal">Nous utilisons un cryptage de bout en bout pour garantir que vous seul pouvez récupérer votre compte.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom: Footer Info */}
                <div className="relative z-10 hidden lg:flex items-center gap-8 pt-12 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>© 2026 Milele Accounting Software</span>
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
                        <h2 className="text-4xl font-black text-slate-950 font-outfit uppercase tracking-tighter mb-3">RECUPÉRATION.</h2>
                        <p className="text-slate-500 font-medium">Entrez votre email pour lancer la procédure.</p>
                    </div>

                    <ForgotPasswordForm />
                </motion.div>
            </div>
        </div>
    );
}
