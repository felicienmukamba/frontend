import { ProductList } from '@/features/resources/components/ProductList';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { PERMISSIONS } from '@/features/auth/lib/permissions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Inventaire & Produits - MILELE Accounting',
};

export default function InventoryPage() {
    return (
        <RoleGuard requiredPermission={PERMISSIONS.PRODUCTS_READ}>
            <div className="container mx-auto py-10">
                <ProductList />
            </div>
        </RoleGuard>
    );
}
