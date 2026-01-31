'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Modular Components
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { WavyBackground } from '@/components/landing/WavyBackground';
import { useAuth } from '@/features/auth/lib/auth-provider';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const { user, logout } = useAuth();

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden font-sans">

      {/* Dynamic Background */}
      <WavyBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-indigo-50 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-lg italic">
                  <Image src="/icon.png" alt="Milele" width={20} height={20} />
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-indigo-950">MILELE AS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
              <Link href="/about" className="hover:text-indigo-600 transition-colors">A propos</Link>
              <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-[150px] justify-end">
            {mounted && (
              user ? (
                <>
                  <Button onClick={logout} className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-10 px-6 font-bold text-sm tracking-tight transition-all hover:scale-105 shadow-xl shadow-indigo-500/10">
                    Se deconnecter
                  </Button>
                  <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                    Connexion
                  </Link>
                  <Button asChild className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-10 px-6 font-bold text-sm tracking-tight transition-all hover:scale-105 shadow-xl shadow-indigo-500/10">
                    <Link href="/setup">Commencer</Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <HeroSection />

        <FeaturesSection />

        {/* Dashboard Preview Section Removed as per request */}

        <SecuritySection />

        <PricingSection />

        <TestimonialsSection />

        <FAQSection />

        {/* CTA */}
        <section className="py-40 px-6 text-center relative overflow-hidden bg-indigo-950">
          <WavyBackground />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white uppercase">
              PRÊT À MIGRER ?
            </h2>
            <p className="text-xl text-indigo-200/80 mb-10 max-w-xl mx-auto font-medium">
              Rejoignez les 500+ entreprises qui ont modernisé leur infrastructure financière avec Milele.
            </p>
            <Button asChild className="h-16 px-12 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 text-xl font-bold tracking-tight shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105">
              <Link href="/contact">Contacter notre équipe commerciale</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-indigo-50 bg-white text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs italic">M</span>
              </div>
              <span className="font-bold text-indigo-950 tracking-tight">MILELE SYSTEMS ®</span>
            </div>
            <div className="flex gap-8 font-semibold">
              <Link href="/status" className="hover:text-indigo-600 cursor-pointer transition-colors">STATUS</Link>
              <Link href="/docs" className="hover:text-indigo-600 cursor-pointer transition-colors">DOCS</Link>
              <Link href="/api-docs" className="hover:text-indigo-600 cursor-pointer transition-colors">API</Link>
              <Link href="/legal" className="hover:text-indigo-600 cursor-pointer transition-colors">LEGAL</Link>
            </div>
            <div className="font-mono text-[10px] opacity-40 uppercase tracking-widest">
              BUILD 2024.01.23
            </div>
          </div>
        </footer>

      </main>
    </div >
  );
}
