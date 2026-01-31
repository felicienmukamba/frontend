'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Activity, Lock } from 'lucide-react';

export function SystemCall() {
    return (
        <div className="w-full bg-[#020617] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    SECURE_SHELL v2.5.0
                </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm space-y-4">
                <div className="flex gap-3">
                    <span className="text-emerald-500">➜</span>
                    <span className="text-slate-300">milele --init --compliance=ohada-2024</span>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                >
                    <div className="text-indigo-400">Initializing Milele Accounting Core...</div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        Connecting to DGI Fiscal Bridge... [CONNECTED]
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Shield className="w-3 h-3 text-indigo-500" />
                        Verifying OHADA Ledger Integrity... [VERIFIED]
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Audit Logs</div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                className="h-full bg-indigo-500"
                            />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 font-mono">HASH: 0x8842...FF21</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Fiscal Status</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-emerald-400 font-bold">READY</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 font-mono">DGI-CERTified</div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <span className="text-emerald-500">➜</span>
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-5 bg-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
