'use client';

import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, DollarSign, TrendingUp, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import { BadgeDRC } from '@/components/ui/PremiumTable';

// HR Dashboard
export function HRDashboard() {
    const headcountData = [
        { department: 'Production', count: 45 },
        { department: 'Ventes', count: 18 },
        { department: 'Admin', count: 12 },
        { department: 'Logistique', count: 22 },
        { department: 'IT', count: 8 },
    ];

    const payrollData = [
        { category: 'Salaires', amount: 85000 },
        { category: 'Cotisations', amount: 22000 },
        { category: 'Avantages', amount: 12000 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Ressources Humaines</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">Gestion des effectifs & Paie</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                            <Users className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="blue">EFFECTIF TOTAL</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">105</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Employés actifs</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="green">RECRUTEMENTS</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">7</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Ce trimestre</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-110">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="purple">MASSE SALARIALE</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">$119K</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Mensuelle</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 transition-transform group-hover:scale-110">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="yellow">DÉPARTEMENTS</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">5</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Actifs</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Headcount by Department */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Répartition par Département</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={headcountData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <YAxis dataKey="department" type="category" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: 'white', fontWeight: 'bold' }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Payroll Breakdown */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Répartition de la Paie</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={payrollData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.category}
                                outerRadius={90}
                                dataKey="amount"
                            >
                                {payrollData.map((entry, index) => {
                                    const colors = ['#10b981', '#6366f1', '#f59e0b'];
                                    return <Cell key={`cell-${index}`} fill={colors[index]} />;
                                })}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 'bold' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Inventory Dashboard
export function InventoryDashboard() {
    const stockData = [
        { category: 'Électronique', stock: 450, min: 200 },
        { category: 'Alimentaire', stock: 1200, min: 800 },
        { category: 'Textile', stock: 680, min: 500 },
        { category: 'Matériaux', stock: 320, min: 400 },
        { category: 'Chimique', stock: 150, min: 100 },
    ];

    const movementData = [
        { month: 'Jan', in: 850, out: 720 },
        { month: 'Fév', in: 920, out: 850 },
        { month: 'Mar', in: 780, out: 680 },
        { month: 'Avr', in: 1100, out: 950 },
        { month: 'Mai', in: 980, out: 890 },
        { month: 'Juin', in: 1050, out: 920 },
    ];

    const lowStockItems = stockData.filter(item => item.stock < item.min);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Gestion des Stocks</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">Inventaire & Mouvements</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 transition-transform group-hover:scale-110">
                            <Package className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="purple">ARTICLES</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">2,800</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">En stock</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 transition-transform group-hover:scale-110">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="red">RUPTURE</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-rose-600 font-mono">{lowStockItems.length}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Catégories</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="blue">VALEUR STOCK</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">$340K</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Valorisé</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="green">ROTATION</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">8.2</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Taux annuel</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stock Levels */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Niveaux de Stock</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stockData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="category" stroke="#94a3b8" style={{ fontSize: '10px', fontWeight: 'bold' }} angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: 'white', fontWeight: 'bold' }} />
                            <Bar dataKey="stock" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="min" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Movement Trends */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Mouvements de Stock</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={movementData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: 'white', fontWeight: 'bold' }} />
                            <Bar dataKey="in" fill="#10b981" name="Entrées" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="out" fill="#ef4444" name="Sorties" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <div className="bg-rose-50 p-8 rounded-[3rem] border border-rose-100">
                    <h4 className="text-lg font-black text-rose-900 uppercase tracking-tight mb-6 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        Alertes de Stock Bas
                    </h4>
                    <div className="space-y-3">
                        {lowStockItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl">
                                <div>
                                    <p className="font-black text-slate-900 text-sm">{item.category}</p>
                                    <p className="text-xs text-slate-400 font-bold">Stock actuel: {item.stock} • Minimum: {item.min}</p>
                                </div>
                                <BadgeDRC variant="red">RÉAPPRO REQUIS</BadgeDRC>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
