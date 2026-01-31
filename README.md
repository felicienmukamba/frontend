# MILELE Accounting Software - Frontend

> **Logiciel de comptabilité moderne et intelligent pour les PME et indépendants en RDC**

Une application Next.js 16 avec TypeScript, Redux Toolkit, et une architecture feature-first professionnelle.

---

## 📚 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Scripts Disponibles](#-scripts-disponibles)
- [Structure du Projet](#-structure-du-projet)
- [Guide du Développeur](#-guide-du-développeur)
- [Conventions de Code](#-conventions-de-code)
- [Authentification & RBAC](#-authentification--rbac)
- [State Management](#-state-management)
- [Styling](#-styling)
- [Tests](#-tests)
- [Déploiement](#-déploiement)

---

## 🎯 Vue d'ensemble

MILELE est une plateforme de comptabilité et gestion financière conçue spécifiquement pour les entreprises en République Démocratique du Congo. Elle offre :

- ✅ Conformité DGI (Direction Générale des Impôts)
- ✅ Gestion multi-devises (USD, CDF)
- ✅ Facturation électronique
- ✅ Synchronisation bancaire
- ✅ Rapports OHADA
- ✅ Multi-tenant avec isolation des données

---

## 🛠 Stack Technique

### Core Framework
- **Next.js 16** (App Router) - Framework React avec SSR/SSG
- **TypeScript** - Typage statique
- **React 19** - Bibliothèque UI

### State Management
- **Redux Toolkit** - Gestion d'état globale
- **RTK Query** - Data fetching et caching
- **React Hook Form** - Gestion de formulaires

### Styling & UI
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Composants UI basés sur Radix
- **Framer Motion** - Animations
- **Lucide React** - Icônes

### Validation
- **Zod** - Schema validation

### Tools
- **ESLint** - Linting
- **date-fns** - Manipulation de dates

---

## 🏗 Architecture

### Feature-First Architecture

Nous utilisons une architecture **feature-first** qui organise le code par domaine métier plutôt que par type technique :

```
src/
├── features/           # Modules métier (Auth, Admin, etc.)
│   ├── auth/
│   │   ├── api/       # RTK Query endpoints
│   │   ├── components/ # Composants liés à l'auth
│   │   ├── lib/       # Utilitaires (AuthProvider, etc.)
│   │   ├── schemas/   # Validation Zod
│   │   ├── slices/    # Redux slices
│   │   └── types/     # TypeScript interfaces
│   └── admin/
│       ├── api/
│       ├── components/
│       ├── schemas/
│       └── types/
├── components/         # Composants réutilisables
│   ├── ui/            # Shadcn components
│   └── layout/        # Headers, Footer, Sidebar
├── store/             # Configuration Redux
├── services/          # Services globaux (API config)
├── lib/               # Utilitaires globaux
└── app/               # Routes Next.js (App Router)
```

### Avantages de cette architecture

1. **Cohésion forte** : Tout le code lié à une fonctionnalité est au même endroit
2. **Scalabilité** : Facile d'ajouter de nouvelles features
3. **Maintenabilité** : Modifications isolées par domaine
4. **Réutilisabilité** : Composants UI séparés des features

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- Backend NestJS en cours d'exécution sur `http://localhost:3000`

### Étapes

```bash
# 1. Cloner le repository
git clone <repo-url>
cd milele-frontend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env.local
cp .env.example .env.local

# 4. Configurer les variables d'environnement
# Éditer .env.local avec vos valeurs

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:3001`

### Variables d'Environnement

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## 📜 Scripts Disponibles

```bash
# Développement
npm run dev              # Lance le serveur de dev (localhost:3001)

# Build
npm run build            # Build production
npm start                # Lance le build en production

# Linting
npm run lint             # Vérifie les erreurs ESLint

# Turbopack (Build system rapide)
npm run dev:turbo        # Dev avec Turbopack
```

---

## 📁 Structure du Projet

### Détails par Répertoire

#### `src/features/`
Chaque feature est un module autonome :

**Exemple : `features/auth/`**
```
auth/
├── api/
│   └── authApi.ts          # RTK Query endpoints (login, register)
├── components/
│   ├── LoginForm.tsx       # Formulaire de connexion
│   ├── RegisterForm.tsx    # Formulaire d'inscription
│   ├── RoleGuard.tsx       # Protection RBAC
│   └── GuestGuard.tsx      # Redirection si authentifié
├── lib/
│   └── auth-provider.tsx   # Context Provider pour auth
├── schemas.ts              # Zod schemas (loginSchema, etc.)
├── slices/
│   └── authSlice.ts        # Redux slice (user, token)
└── types/
    └── index.ts            # Interfaces (User, Role, AuthResponse)
```

#### `src/components/ui/`
Composants Shadcn/ui réutilisables (Button, Dialog, Input, etc.)

#### `src/store/`
Configuration Redux Toolkit :
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import authReducer from '@/features/auth/slices/authSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

#### `src/services/api.ts`
Configuration RTK Query avec cache tags :
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  }),
  tagTypes: ['Auth', 'User', 'Company', 'Role', 'Branch', 'AuditLog'],
  endpoints: () => ({}),
});
```

---

## 👨‍💻 Guide du Développeur

### Ajouter une Nouvelle Feature

1. **Créer la structure**
```bash
mkdir -p src/features/invoices/{api,components,schemas,types}
```

2. **Définir les types** (`types/index.ts`)
```typescript
export interface Invoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  // ...
}
```

3. **Créer les endpoints API** (`api/invoicesApi.ts`)
```typescript
import { api } from '@/services/api';

export const invoicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => '/invoices',
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation({
      query: (invoice) => ({
        url: '/invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const { useGetInvoicesQuery, useCreateInvoiceMutation } = invoicesApi;
```

4. **Créer les composants**
```tsx
// components/InvoiceList.tsx
export function InvoiceList() {
  const { data, isLoading } = useGetInvoicesQuery();
  // ...
}
```

5. **Créer la page** (`app/invoices/page.tsx`)
```tsx
import { InvoiceList } from '@/features/invoices/components/InvoiceList';

export default function InvoicesPage() {
  return <InvoiceList />;
}
```

### Utiliser RTK Query

**Faire une requête GET :**
```tsx
const { data, isLoading, error } = useGetUsersQuery({ page: 1, limit: 10 });
```

**Faire une mutation (POST/PUT/DELETE) :**
```tsx
const [createUser, { isLoading }] = useCreateUserMutation();

const handleSubmit = async (data) => {
  try {
    await createUser(data).unwrap();
    toast.success('Utilisateur créé');
  } catch (error) {
    toast.error('Erreur');
  }
};
```

### Utiliser React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
}
```

---

## 📝 Conventions de Code

### Naming Conventions

- **Composants** : PascalCase (`UserList.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`)
- **Utilitaires** : camelCase (`formatCurrency.ts`)
- **Types/Interfaces** : PascalCase (`User`, `AuthResponse`)
- **Constantes** : UPPER_SNAKE_CASE (`API_BASE_URL`)

### Structure de Fichier

```tsx
// 1. Imports externes
import { useState } from 'react';

// 2. Imports internes
import { Button } from '@/components/ui/button';

// 3. Types
interface Props {
  title: string;
}

// 4. Composant
export function MyComponent({ title }: Props) {
  // ...
}
```

### TypeScript

- ✅ Toujours typer explicitement les props
- ✅ Utiliser `interface` pour les objets
- ✅ Utiliser `type` pour les unions/intersections
- ❌ Éviter `any` (préférer `unknown`)

---

## 🔐 Authentification & RBAC

### Rôles Disponibles

```typescript
enum UserRole {
  SUPERADMIN = 'SUPERADMIN',  // Accès total
  ADMIN = 'ADMIN',            // Gestion entreprise
  MANAGER = 'MANAGER',        // Supervision
  ACCOUNTANT = 'ACCOUNTANT',  // Comptabilité
  CASHIER = 'CASHIER',        // Caisse
  HR_MANAGER = 'HR_MANAGER',  // RH
  FINANCE = 'FINANCE',        // Finance
}
```

### Protéger une Route

```tsx
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { UserRole } from '@/features/auth/types';

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.SUPERADMIN, UserRole.ADMIN]}>
      {/* Contenu protégé */}
    </RoleGuard>
  );
}
```

### Vérifier les Permissions

```tsx
import { useAuth } from '@/features/auth/lib/auth-provider';

function MyComponent() {
  const { hasRole, isSuperAdmin } = useAuth();

  if (hasRole([UserRole.ADMIN, UserRole.MANAGER])) {
    return <AdminPanel />;
  }

  return <RegularView />;
}
```

---

## 🗂 State Management

### Redux Store Structure

```
store
├── auth
│   ├── user: User | null
│   ├── token: string | null
│   └── isAuthenticated: boolean
└── api (RTK Query)
    ├── queries (cached data)
    └── mutations
```

### Accéder au State

```tsx
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';

function Profile() {
  const user = useAppSelector(selectCurrentUser);
  return <div>{user?.email}</div>;
}
```

---

## 🎨 Styling

### Tailwind Classes

Utilisez Tailwind de manière sémantique :

```tsx
<button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
  Enregistrer
</button>
```

### Composants Shadcn

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

<Button variant="destructive" size="lg">
  Supprimer
</Button>
```

### Animations Framer Motion

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenu animé
</motion.div>
```

---

## 🧪 Tests

```bash
# Lancer ESLint
npm run lint
```

*Note : Tests unitaires à venir (Jest, React Testing Library)*

---

## 🚢 Déploiement

### Build Production

```bash
npm run build
npm start
```

### Variables d'Environnement Production

```env
NEXT_PUBLIC_API_URL=https://api.milele.app
NODE_ENV=production
```

### Plateformes Recommandées

- **Vercel** (optimisé pour Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**

---

## 🤝 Contribution

1. Créer une branche feature : `git checkout -b feature/ma-fonctionnalite`
2. Commiter les changements : `git commit -m "feat: ajoute X"`
3. Pusher la branche : `git push origin feature/ma-fonctionnalite`
4. Ouvrir une Pull Request

### Convention de Commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage (pas de changement de code)
refactor: refactoring
test: ajout de tests
chore: tâches diverses
```

---

## 📞 Support

Pour toute question :
- **Email** : support@milele.app
- **Documentation** : docs.milele.app

---

## 📄 License

Propriétaire - MILELE SAS © 2026

---

## 🚀 Dernières Mises à Jour (Janvier 2026)

### 🧩 Core & State Management
- **Centralisation du `companyId`** : Intégration du `companyId` directement dans le `AuthContext` via `AuthProvider`. Plus besoin de fallbacks manuels dans les composants.
- **Robustesse des Dialogues** : Mise à jour de tous les formulaires (Invoices, Accounts, Employees, etc.) pour utiliser le `companyId` centralisé avec validation de présence.

### 💰 Module Ventes & Totaux Facturés
- **Correction Définitive du Bug `[object Object]` (Solution Blindée)** :
    - **Problème** : Affichage d'objets `Decimal` au lieu de nombres suite à leur passage par l'API JSON.
    - **Solution** : Double protection via conversion backend (Intercepteur) et utilité de secours frontend (`safeNumber`).
- **Réactivité Ultra-fluide** : Recalcul instantané des montants (HT, TVA, TTC) via `useWatch`.
- **Validation DGI** : Flux de validation sécurisé avec retour visuel immédiat.


