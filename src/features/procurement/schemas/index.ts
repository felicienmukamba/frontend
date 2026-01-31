import { z } from "zod";

export const purchaseOrderLineSchema = z.object({
    productId: z.coerce.number().min(1, "Le produit est obligatoire"),
    quantity: z.coerce.number().min(1, "La quantité doit être supérieure à 0"),
    unitPrice: z.coerce.number().min(0, "Le prix unitaire doit être positif"),
    description: z.string().optional(),
});

export const purchaseOrderSchema = z.object({
    supplierId: z.coerce.number().min(1, "Le fournisseur est obligatoire"),
    orderDate: z.string().optional(),
    expectedDate: z.string().optional(),
    currency: z.string().min(1, "La devise est obligatoire").default("USD"),
    notes: z.string().optional(),
    lines: z.array(purchaseOrderLineSchema).min(1, "La commande doit contenir au moins une ligne"),
});

export const stockReceptionLineSchema = z.object({
    productId: z.coerce.number().min(1, "Le produit est obligatoire"),
    quantity: z.coerce.number().min(1, "La quantité reçue doit être supérieure à 0"),
    unitCost: z.coerce.number().min(0, "Le coût unitaire doit être positif"),
});

export const stockReceptionSchema = z.object({
    supplierId: z.coerce.number().min(1, "Le fournisseur est obligatoire"),
    purchaseOrderId: z.string().optional(),
    documentReference: z.string().min(1, "La référence du document est obligatoire"),
    notes: z.string().optional(),
    lines: z.array(stockReceptionLineSchema).min(1, "La réception doit contenir au moins une ligne"),
});

export type PurchaseOrderSchema = z.infer<typeof purchaseOrderSchema>;
export type StockReceptionSchema = z.infer<typeof stockReceptionSchema>;
