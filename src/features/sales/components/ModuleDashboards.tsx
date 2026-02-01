'use client';

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingCart, Package, TrendingDown } from 'lucide-react';
import { BadgeDRC } from '@/components/ui/PremiumTable';

const mockSalesData = [
    { month: 'Jan', revenue: 45000, invoices: 23 },
    { month: 'Fév', revenue: 52000, invoices: 28 },
    { month: 'Mar', revenue: 48000, invoices: 25 },
    { month: 'Avr', revenue: 61000, invoices: 32 },
    { month: 'Mai', revenue: 55000, invoices: 29 },
    { month: 'Juin', revenue: 67000, invoices: 35 },
];

const topCustomers = [
    { name: 'Entreprise Minière du Congo', revenue: 125000, invoices: 15 },
    { name: 'Commerce Général Kivu', revenue: 98000, invoices: 22 },
    { name: 'Services Industriels SA', revenue: 85000, invoices: 18 },
    { name: 'Distribution Centrale', revenue: 72000, invoices: 14 },
];

const invoiceStatus = [
    { name: 'Payées', value: 65, color: '#10b981' },
    { name: 'En attente', value: 25, color: '#f59e0b' },
    { name: 'En retard', value: 10, color: '#ef4444' },
];

export function SalesDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Ventes & Facturation</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">Performance commerciale & Revenue</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="green">CA DU MOIS</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">$67,000</div>
                    <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">+22% vs mai</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-110">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="blue">FACTURES</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">35</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Ce mois-ci</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                            <Users className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="blue">CLIENTS ACTIFS</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">42</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">+3 ce mois</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 transition-transform group-hover:scale-110">
                            <Package className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="yellow">PANIER MOYEN</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">$1,914</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Par facture</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Évolution du CA</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={mockSalesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: 'white', fontWeight: 'bold' }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Invoice Status */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Statut des Factures</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={invoiceStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {invoiceStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 'bold' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Top Clients</h4>
                <div className="space-y-4">
                    {topCustomers.map((customer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="font-black text-indigo-600">#{idx + 1}</span>
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 text-sm">{customer.name}</p>
                                    <p className="text-xs text-slate-400 font-bold">{customer.invoices} factures</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-emerald-600 font-mono text-lg">${customer.revenue.toLocaleString()}</p>
                                <p className="text-xs text-slate-400 font-bold">Revenue total</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PurchasesDashboard() {
    const purchaseData = [
        { month: 'Jan', expenses: 32000 },
        { month: 'Fév', expenses: 38000 },
        { month: 'Mar', expenses: 35000 },
        { month: 'Avr', expenses: 42000 },
        { month: 'Mai', expenses: 39000 },
        { month: 'Juin', expenses: 45000 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Achats & Approvisionnements</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">Gestion des dépenses & Fournisseurs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="red">DÉPENSES</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">$45,000</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Ce mois-ci</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                            <Users className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="purple">FOURNISSEURS</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">24</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">Actifs</div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <BadgeDRC variant="yellow">COMMANDES</BadgeDRC>
                    </div>
                    <div className="text-3xl font-black text-slate-900 font-mono">18</div>
                    <div className="text-xs text-slate-400 font-bold uppercase mt-2">En cours</div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Évolution des Dépenses</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={purchaseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: 'white', fontWeight: 'bold' }} />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
