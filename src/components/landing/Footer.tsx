'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Footer() {
    return (
        <>
            {/* Final CTA */}
            <section className="relative py-24 bg-gradient-to-b from-white via-purple-50/50 to-white border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Prêt à libérer votre temps ?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Rejoignez des milliers d'entrepreneurs qui ont simplifié leur comptabilité.
                    </p>
                    <Button size="lg" className="h-14 min-w-[220px] text-lg rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-xl">
                        <Link href="/register" className="flex items-center gap-2">
                            Commencer gratuitement <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <p className="text-sm text-gray-500 mt-4">14 jours d'essai • Sans carte bancaire</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12 text-center md:text-left">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-lg font-bold text-gray-900">MILELE</span>
                        <span className="text-sm text-gray-500">© 2026 Milele Inc. Tous droits réservés.</span>
                    </div>

                    <div className="flex gap-8 text-sm text-gray-600">
                        <Link href="#" className="hover:text-gray-900 transition-colors">Confidentialité</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">Conditions</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
