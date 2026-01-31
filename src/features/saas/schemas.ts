import * as z from 'zod';

export const saasCompanySchema = z.object({
    companyName: z.string().min(2, "La raison sociale est requise"),
    rccm: z.string().min(1, "Le RCCM est requis"),
    nationalId: z.string().min(1, "L'ID National est requis"),
    taxId: z.string().min(1, "Le NIF est requis"),
    headquartersAddress: z.string().min(5, "L'adresse du siège est requise"),
    phone: z.string().min(9, "Téléphone invalide"),
    email: z.string().email("Email invalide"),
    taxRegime: z.string().min(1, "Régime fiscal requis"),
    taxCenter: z.string().min(1, "Centre fiscal requis"),
});

export type SaaSCompanySchema = z.infer<typeof saasCompanySchema>;
