'use client';

import { PurchaseOrderList } from "@/features/procurement/components/PurchaseOrderList";

export default function PurchaseOrdersPage() {
    return (
        <div className="container mx-auto py-6">
            <PurchaseOrderList />
        </div>
    );
}
