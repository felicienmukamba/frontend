export const PERMISSIONS = {
    // Users & Roles
    USERS_READ: 'users:read',
    USERS_WRITE: 'users:write',
    USERS_DELETE: 'users:delete',
    ROLES_READ: 'roles:read',
    ROLES_WRITE: 'roles:write',

    // Resources
    PRODUCTS_READ: 'products:read',
    PRODUCTS_WRITE: 'products:write',
    THIRD_PARTIES_READ: 'third_parties:read',
    THIRD_PARTIES_WRITE: 'third_parties:write',

    // Sales
    INVOICES_READ: 'invoices:read',
    INVOICES_WRITE: 'invoices:write',
    INVOICES_VALIDATE: 'invoices:validate',
    CREDIT_NOTES_READ: 'credit_notes:read',
    CREDIT_NOTES_WRITE: 'credit_notes:write',

    // Accounting
    ACCOUNTS_READ: 'accounts:read',
    ACCOUNTS_WRITE: 'accounts:write',
    ENTRIES_READ: 'entries:read',
    ENTRIES_WRITE: 'entries:write',
    REPORTS_READ: 'reports:read',

    // System
    COMPANY_SETTINGS: 'company:settings',
    BRANCHES_MANAGE: 'branches:manage',

    // HR
    HR_READ: 'hr:read',
    HR_WRITE: 'hr:write',
    HR_PAYROLL: 'hr:payroll',

    // Budgeting
    BUDGETS_READ: 'budgets:read',
    BUDGETS_WRITE: 'budgets:write',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const PERMISSION_GROUPS = [
    {
        label: 'Ventes & Facturation',
        permissions: [
            { id: PERMISSIONS.INVOICES_READ, label: 'Consulter factures' },
            { id: PERMISSIONS.INVOICES_WRITE, label: 'Établir factures' },
            { id: PERMISSIONS.INVOICES_VALIDATE, label: 'Valider factures' },
            { id: PERMISSIONS.CREDIT_NOTES_READ, label: 'Consulter avoirs' },
        ]
    },
    {
        label: 'Stocks & Tiers',
        permissions: [
            { id: PERMISSIONS.PRODUCTS_READ, label: 'Consulter stock' },
            { id: PERMISSIONS.PRODUCTS_WRITE, label: 'Mise à jour stock' },
            { id: PERMISSIONS.THIRD_PARTIES_READ, label: 'Consulter clients/fournisseurs' },
            { id: PERMISSIONS.THIRD_PARTIES_WRITE, label: 'Gérer tiers' },
        ]
    },
    {
        label: 'Comptabilité',
        permissions: [
            { id: PERMISSIONS.ACCOUNTS_READ, label: 'Plan comptable' },
            { id: PERMISSIONS.ENTRIES_WRITE, label: 'Saisie écritures' },
            { id: PERMISSIONS.REPORTS_READ, label: 'États financiers' },
        ]
    },
    {
        label: 'Administration',
        permissions: [
            { id: PERMISSIONS.USERS_WRITE, label: 'Gérer utilisateurs' },
            { id: PERMISSIONS.ROLES_WRITE, label: 'Gérer rôles' },
            { id: PERMISSIONS.COMPANY_SETTINGS, label: 'Configuration société' },
        ]
    },
    {
        label: 'RH & Paye',
        permissions: [
            { id: PERMISSIONS.HR_READ, label: 'Consulter employés' },
            { id: PERMISSIONS.HR_WRITE, label: 'Gérer personnel' },
            { id: PERMISSIONS.HR_PAYROLL, label: 'Calcul paie' },
        ]
    },
    {
        label: 'Budgets',
        permissions: [
            { id: PERMISSIONS.BUDGETS_READ, label: 'Consulter budgets' },
            { id: PERMISSIONS.BUDGETS_WRITE, label: 'Établir budgets' },
        ]
    }
];

export const ROLE_LABELS: Record<string, string> = {
    SUPERADMIN: 'Super Administrateur SaaS',
    ADMIN_COMPANY: 'Administrateur Entreprise',
    ADMIN_BRANCH: 'Administrateur Succursale',
    CAISSIER: 'Caissier',
    COMPTABLE: 'Comptable',
    RH: 'Responsable RH',
    DIRECTEUR_FINANCIER: 'Directeur Financier',
    GERANT: 'Gérant',
};
