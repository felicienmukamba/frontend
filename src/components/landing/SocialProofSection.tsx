'use client';

import { motion } from 'motion/react';

const logos = [
    "La Tribune", "Les Échos", "BFM Business", "Maddyness", "Le Monde", "TechCrunch", "Forbes"
];

export function SocialProofSection() {
    return (
        <section className="relative py-16 bg-white overflow-hidden border-y border-gray-100">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Propulsé par la confiance des meilleurs</p>
            </div>

            <div className="relative flex overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex whitespace-nowrap gap-16 md:gap-32 items-center"
                >
                    {[...logos, ...logos].map((logo, i) => (
                        <span
                            key={i}
                            className="text-2xl md:text-3xl font-black text-gray-200 hover:text-gray-900 transition-colors cursor-default select-none"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>

                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
            </div>
        </section>
    );
}
