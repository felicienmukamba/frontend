import * as z from 'zod';
import { InvoiceType } from '../types';

export const invoiceLineSchema = z.object({
    productId: z.number().positive("Le produit est requis"),
    quantity: z.number().int().positive("La quantité doit être positive"),
    unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
    taxId: z.number().positive("La taxe est requise"),
    description: z.string().optional(),
});

export const invoiceSchema = z.object({
    type: z.nativeEnum(InvoiceType),
    invoiceNumber: z.string().min(1, "Le numéro de facture est requis"),
    internalReference: z.string().optional().or(z.literal('')),
    currency: z.string().default('USD'),
    exchangeRate: z.coerce.number().positive().default(1),
    thirdPartyId: z.number().positive("Le client est requis"),
    lines: z.array(invoiceLineSchema).min(1, "Au moins une ligne de facture est requise"),
    isPaid: z.boolean().default(false),
    paymentMethod: z.string().optional(),
    issuedAt: z.string().optional(), // Date of invoice
    paymentDate: z.string().optional(), // Date of payment if isPaid is true
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;
export type InvoiceLineSchema = z.infer<typeof invoiceLineSchema>;

export const paymentSchema = z.object({
    invoiceId: z.string(),
    amount: z.coerce.number().positive("Le montant doit être positif"),
    paymentDate: z.string().min(1, "La date de paiement est requise"),
    paymentMethod: z.string().min(1, "Le mode de paiement est requis"),
    reference: z.string().optional().or(z.literal('')),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;

export const taxSchema = z.object({
    code: z.string().min(1, "Le code est requis"),
    rate: z.coerce.number().min(0, "Le taux doit être positif"),
    label: z.string().min(1, "Le libellé est requis"),
    isDeductible: z.boolean().default(false),
});

export type TaxSchema = z.infer<typeof taxSchema>;
