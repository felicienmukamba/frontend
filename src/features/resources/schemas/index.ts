import * as z from 'zod';
import { ThirdPartyType, ProductType } from '../types';

export const thirdPartySchema = z.object({
    type: z.nativeEnum(ThirdPartyType),
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    taxId: z.string().optional().or(z.literal('')),
    rccm: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    email: z.string().email("Email invalide").optional().or(z.literal('')),
    isVatSubject: z.boolean().default(false),
    creditLimit: z.coerce.number().min(0).optional(),
});

export type ThirdPartySchema = z.infer<typeof thirdPartySchema>;

export const productSchema = z.object({
    sku: z.string().min(1, "La référence est requise"),
    name: z.string().min(2, "La désignation doit contenir au moins 2 caractères"),
    type: z.nativeEnum(ProductType),
    salesPriceExclTax: z.coerce.number().min(0, "Le prix de vente doit être positif"),
    purchasePriceExclTax: z.coerce.number().min(0, "Le prix d'achat doit être positif"),
    currentStock: z.coerce.number().int().optional().default(0),
    alertStock: z.coerce.number().int().optional().default(0),
    barcode: z.string().optional().or(z.literal('')),
});

export type ProductSchema = z.infer<typeof productSchema>;
