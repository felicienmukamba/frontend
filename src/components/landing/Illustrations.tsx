'use client';

import { motion } from 'framer-motion';

export const DashboardIllustration = () => (
    <div className="relative w-full aspect-[16/10] bg-[#020617] rounded-2xl border border-white/10 shadow-2xl overflow-hidden group">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px]" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 z-20">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="h-4 w-32 bg-white/10 rounded-md" />
            <div className="w-6 h-6 rounded-full bg-white/10" />
        </div>

        {/* Sidebar */}
        <div className="absolute left-0 top-12 bottom-0 w-16 border-r border-white/5 bg-white/5 backdrop-blur-sm flex flex-col items-center py-6 gap-6 z-10">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded bg-indigo-500" />
            </div>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 rounded-md bg-white/5 border border-white/5" />
            ))}
        </div>

        {/* Main Content */}
        <div className="absolute left-16 right-0 top-12 bottom-0 p-8 pt-6">
            <div className="grid grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="h-28 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 relative overflow-hidden group/card"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                        <div className="flex items-end justify-between">
                            <div className="h-6 w-24 bg-white/30 rounded" />
                            <div className="h-8 w-8 bg-indigo-500/20 rounded-lg" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="relative h-56 rounded-2xl bg-slate-900/50 border border-white/10 p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-32 bg-white/20 rounded" />
                    <div className="flex gap-2">
                        <div className="h-6 w-12 bg-indigo-500/20 rounded border border-indigo-500/30" />
                        <div className="h-6 w-12 bg-white/5 rounded border border-white/10" />
                    </div>
                </div>

                <div className="absolute inset-x-6 bottom-6 h-32 flex items-end gap-3 z-0">
                    {[40, 70, 55, 85, 60, 95, 80, 100, 75, 50, 65, 90].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + (i * 0.04), duration: 0.8 }}
                            className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 opacity-40 hover:opacity-100 transition-opacity relative group/bar"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                {h}%
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trend Line */}
                <svg className="absolute inset-x-6 bottom-6 h-32 w-full z-10 pointer-events-none overflow-visible">
                    <motion.path
                        d="M 0 80 L 40 60 L 80 90 L 120 40 L 160 70 L 200 30 L 240 50 L 280 10 L 320 40 L 360 20 L 400 60 L 440 30"
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.5)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                    />
                </svg>
            </div>
        </div>
    </div>
);

export const SecurityVaultIllustration = () => (
    <div className="relative w-full aspect-square flex items-center justify-center">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute w-[80%] h-[80%] border border-dashed border-indigo-500/20 rounded-full"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute w-[60%] h-[60%] border border-indigo-500/10 rounded-full"
        />

        <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-56 h-56 rounded-[3rem] bg-[#020617] border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.1)] flex items-center justify-center group overflow-hidden"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1),transparent)]" />

            <div className="relative z-10 w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 overflow-hidden">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {[0, 120, 240].map((angle, i) => (
                <motion.div
                    key={i}
                    animate={{
                        rotate: [angle, angle + 360],
                    }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute w-full h-full p-8"
                >
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </motion.div>
            ))}
        </motion.div>
    </div>
);

export const FinancialGrowthIllustration = () => (
    <div className="relative w-full aspect-square flex items-center justify-center p-8">
        <div className="absolute inset-4 bg-slate-900/40 rounded-[3rem] border border-white/5 backdrop-blur-sm -z-10" />

        <div className="relative w-full h-full flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="h-2 w-16 bg-white/10 rounded" />
                    <div className="h-8 w-32 bg-white/20 rounded-lg flex items-center px-3">
                        <div className="w-4 h-4 bg-indigo-500 rounded-full mr-2" />
                        <div className="h-3 w-16 bg-white/20 rounded" />
                    </div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            <div className="relative flex-1 mt-12 mb-8">
                <svg width="100%" height="100%" viewBox="0 0 240 120" fill="none" className="overflow-visible">
                    {[0, 30, 60, 90, 120].map((y) => (
                        <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    ))}

                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M 0 100 Q 40 110 80 80 T 160 60 T 240 20"
                        stroke="url(#grad-growth)"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    <defs>
                        <linearGradient id="grad-growth" x1="0" y1="120" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6366f1" />
                            <stop offset="0.5" stopColor="#a855f7" />
                            <stop offset="1" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>

                    <motion.circle
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        cx="240" cy="20" r="6" fill="#ec4899"
                    />
                </svg>
            </div>

            <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ delay: 1 + (i * 0.2), duration: 1 }}
                            className="h-full bg-slate-700"
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

