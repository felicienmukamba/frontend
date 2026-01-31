import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const extractArray = <T>(data: any): T[] => {
  if (!data) return [];

  // 1. If it's already an array
  if (Array.isArray(data)) return data;

  // 2. Handle double nested { data: { data: [...] } } (Paginated response wrapped in Global Interceptor)
  if (data.data?.data && Array.isArray(data.data.data)) return data.data.data;

  // 3. Handle standard { data: [...] } wrapper
  if (data.data && Array.isArray(data.data)) return data.data;

  // 4. Handle PaginatedResponse format direct check (if unwrapped or different structure)
  if (data.meta && Array.isArray(data.data)) return data.data;

  return [];
};

export const extractMeta = (data: any) => {
  if (!data) return null;

  // If double nested { data: { meta: {...} } }
  if (data.data?.meta) return data.data.meta;

  // If single nested { meta: {...} }
  if (data.meta) return data.meta;

  return null;
};


export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Safely converts any value to a number.
 * Especially useful for handling Prisma Decimal objects that might arrive as { d, s, e }
 */
export const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;

  // Handle objects (like Prisma Decimal POJOs)
  if (typeof value === 'object') {
    if (value.toString && typeof value.toString === 'function' && value.toString() !== '[object Object]') {
      return parseFloat(value.toString()) || 0;
    }
    // Deep fallback for decimal.js structure { d: [], s: 1, e: 0 }
    if ('d' in value && 's' in value) {
      // We could implement the full logic here, but usually toString() should have been handled 
      // If it's a POJO from the wire, it won't have the decimal.js methods.
      // The backend should have converted it, but if it didn't...
      return 0;
    }
  }

  return Number(value) || 0;
};

export const safeFormatDate = (dateStr?: string | Date, formatStr: string = 'dd MMM yyyy') => {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '-';
    return format(date, formatStr, { locale: fr });
  } catch (error) {
    return '-';
  }
};
