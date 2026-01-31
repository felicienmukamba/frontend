'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function WavyBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            <svg
                className="absolute top-0 right-0 w-[120%] h-full text-indigo-100/50"
                viewBox="0 0 1000 1000"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path
                            d="M0 50 Q 25 25 50 50 T 100 50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                        />
                    </pattern>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="1" />
                    </radialGradient>
                </defs>

                {/* Animated Wavy Lines */}
                <motion.g
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <ellipse
                            key={i}
                            cx="1000"
                            cy="200"
                            rx={600 + i * 40}
                            ry={400 + i * 20}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="opacity-20"
                        />
                    ))}
                </motion.g>

                {/* Mask to fade edges */}
                <rect width="100%" height="100%" fill="url(#grad1)" />
            </svg>

            {/* Subtle Mesh Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[100px] opacity-40" />
        </div>
    );
}
