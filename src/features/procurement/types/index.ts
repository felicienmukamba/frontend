export enum PurchaseOrderStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
    RECEIVED = 'RECEIVED',
    CANCELLED = 'CANCELLED',
}

export interface PurchaseOrderLine {
    id: string;
    productId: number;
    product?: {
        id: number;
        name: string;
        sku: string;
    };
    quantity: number;
    unitPrice: number;
    receivedQuantity: number;
    description?: string;
}

export interface PurchaseOrder {
    id: string;
    orderNumber: string;
    supplierId: number;
    supplier?: {
        id: number;
        name: string;
    };
    orderDate: string;
    expectedDate?: string;
    status: PurchaseOrderStatus;
    totalAmount: number;
    currency: string;
    notes?: string;
    lines: PurchaseOrderLine[];
    receptions?: StockReception[];
    createdAt: string;
    updatedAt: string;
}

export interface StockReceptionLine {
    productId: number;
    quantity: number;
    unitCost: number;
}

export interface StockReception {
    id: string;
    receptionNumber: string;
    purchaseOrderId?: string;
    purchaseOrder?: Partial<PurchaseOrder>;
    supplierId: number;
    supplier?: {
        id: number;
        name: string;
    };
    receptionDate: string;
    documentReference?: string;
    notes?: string;
    movements?: any[];
    createdAt: string;
}

export interface CreatePurchaseOrderRequest {
    supplierId: number;
    orderDate?: string;
    expectedDate?: string;
    currency?: string;
    notes?: string;
    lines: {
        productId: number;
        quantity: number;
        unitPrice: number;
        description?: string;
    }[];
}

export interface CreateStockReceptionRequest {
    supplierId: number;
    purchaseOrderId?: string;
    documentReference?: string;
    notes?: string;
    lines: StockReceptionLine[];
}
