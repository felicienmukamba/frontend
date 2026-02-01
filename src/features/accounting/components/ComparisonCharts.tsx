'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ComparisonData {
    month: string;
    revenue: number;
    expenses: number;
    netIncome: number;
}

interface ComparisonChartsProps {
    fiscalYearIds: number[];
}

export function ComparisonCharts({ fiscalYearIds }: ComparisonChartsProps) {
    // In a real implementation, fetch comparison data from API
    const mockData: ComparisonData[] = [
        { month: 'Jan', revenue: 120000, expenses: 80000, netIncome: 40000 },
        { month: 'Fév', revenue: 150000, expenses: 95000, netIncome: 55000 },
        { month: 'Mar', revenue: 180000, expenses: 110000, netIncome: 70000 },
        { month: 'Avr', revenue: 160000, expenses: 105000, netIncome: 55000 },
        { month: 'Mai', revenue: 190000, expenses: 115000, netIncome: 75000 },
        { month: 'Juin', revenue: 210000, expenses: 125000, netIncome: 85000 },
    ];

    return (
        <div className="space-y-8">
            {/* Revenue Trend Chart */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Évolution du Chiffre d'Affaires</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tendances mensuelles</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '1rem',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6366f1"
                            strokeWidth={3}
                            name="Revenus"
                            dot={{ fill: '#6366f1', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue vs Expenses Bar Chart */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Revenus vs Charges</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Analyse comparative</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '1rem',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Bar dataKey="revenue" fill="#10b981" name="Revenus" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" name="Charges" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Net Income Trend */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[3rem] border border-indigo-500 shadow-2xl shadow-indigo-600/20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Résultat Net</h4>
                        <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Performance globale</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <YAxis stroke="rgba(255,255,255,0.7)" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                border: 'none',
                                borderRadius: '1rem',
                                color: '#1e293b',
                                fontWeight: 'bold'
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }} />
                        <Line
                            type="monotone"
                            dataKey="netIncome"
                            stroke="#fbbf24"
                            strokeWidth={4}
                            name="Résultat Net"
                            dot={{ fill: '#fbbf24', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
