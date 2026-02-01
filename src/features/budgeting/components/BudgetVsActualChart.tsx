'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetVsActualChartProps {
    data?: any[];
}

export const BudgetVsActualChart = ({ data = [] }: BudgetVsActualChartProps) => {
    // Transform data for chart if necessary, or assume it's passed correctly
    // Expected format: { name: 'Category', budget: 1000, actual: 800 }

    return (
        <Card className="col-span-1 md:col-span-2 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 font-outfit">Comparaison Budget vs Réel</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            fontFamily="var(--font-outfit)"
                            fontWeight={700}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            fontFamily="var(--font-outfit)"
                            fontWeight={700}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontFamily: 'var(--font-outfit)', fontWeight: 700 }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontFamily: 'var(--font-outfit)', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                        <Bar
                            dataKey="budget"
                            name="Budget Alloué"
                            fill="#059669"
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                        />
                        <Bar
                            dataKey="actual"
                            name="Dépenses Réelles"
                            fill="#8b5cf6"
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
