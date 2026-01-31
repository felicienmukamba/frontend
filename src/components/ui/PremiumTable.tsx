'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export function PremiumTable({ children, className, ...props }: PremiumTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm ring-1 ring-slate-200/20">
            <div className="overflow-x-auto scrollbar-hide">
                <table className={cn("w-full text-sm text-left border-collapse", className)} {...props}>
                    {children}
                </table>
            </div>
        </div>
    );
}

interface PremiumTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children?: React.ReactNode;
}

export function PremiumTableHeader({ children, className, ...props }: PremiumTableHeaderProps) {
    return (
        <thead className={cn("bg-slate-50/50 border-b border-slate-100", className)} {...props}>
            {children}
        </thead>
    );
}

interface PremiumTableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
    children?: React.ReactNode;
}

export function PremiumTableHead({ children, className, ...props }: PremiumTableHeadProps) {
    return (
        <th className={cn("px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap", className)} {...props}>
            {children}
        </th>
    );
}

interface PremiumTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children?: React.ReactNode;
}

export function PremiumTableBody({ children, className, ...props }: PremiumTableBodyProps) {
    return (
        <tbody className={cn("divide-y divide-slate-50", className)} {...props}>
            {children}
        </tbody>
    );
}

interface PremiumTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children?: React.ReactNode;
    onClick?: () => void;
}

export function PremiumTableRow({ children, className, onClick, ...props }: PremiumTableRowProps) {
    return (
        <tr
            onClick={onClick}
            className={cn(
                "transition-colors hover:bg-slate-50/50 group/row",
                onClick && "cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </tr>
    );
}

interface PremiumTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children?: React.ReactNode;
}

export function PremiumTableCell({ children, className, ...props }: PremiumTableCellProps) {
    return (
        <td className={cn("px-6 py-4.5 text-slate-600 font-medium whitespace-nowrap", className)} {...props}>
            {children}
        </td>
    );
}

export function BadgeDRC({ children, variant = 'blue' }: { children: React.ReactNode; variant?: 'blue' | 'yellow' | 'red' | 'green' | 'slate' | 'purple' | 'danger' }) {
    const styles = {
        blue: "bg-blue-50 text-drc-blue border-blue-100 shadow-blue-500/5",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-500/5",
        red: "bg-red-50 text-red-700 border-red-100 shadow-red-500/5",
        green: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/5",
        slate: "bg-slate-50 text-slate-600 border-slate-200 shadow-slate-500/5",
        purple: "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-indigo-500/5",
        danger: "bg-red-50 text-drc-red border-red-100 shadow-red-500/5",
    };

    return (
        <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm",
            styles[variant]
        )}>
            {children}
        </span>
    );
}
