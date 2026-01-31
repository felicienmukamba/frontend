// Resources Module Types - Extended with Stock Movements

export interface StockMovement {
    id: number;
    type: 'ENTRY' | 'EXIT' | 'TRANSFER' | 'ADJUSTMENT';
    documentReference?: string;
    movementDate: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    productId: number;
    product?: { id: number; name: string; sku: string };
    thirdPartyId?: number;
    thirdParty?: { id: number; name: string };
    fromBranchId?: number;
    toBranchId?: number;
    companyId: number;
    createdById: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStockMovementDto {
    companyId: number;
    type: 'ENTRY' | 'EXIT' | 'TRANSFER' | 'ADJUSTMENT';
    documentReference?: string;
    movementDate: string;
    quantity: number;
    unitCost: number;
    productId: number;
    thirdPartyId?: number;
    fromBranchId?: number;
    toBranchId?: number;
    createdById: number;
}

export interface UpdateStockMovementDto extends Partial<CreateStockMovementDto> {
    id: number;
}

export enum ThirdPartyType {
    CUSTOMER = 'CUSTOMER',
    SUPPLIER = 'SUPPLIER',
}

export interface PaginatedResponse<T> {
    data: T[];
    meta?: {
        total: number;
        page: number;
        last_page: number;
        limit: number;
    };
}

export type StockMovementListResponse = PaginatedResponse<StockMovement> | StockMovement[];

// Re-export existing types
export interface ThirdParty {
    id: number;
    type: ThirdPartyType;
    name: string;
    taxId?: string;
    rccm?: string;
    address?: string;
    phone?: string;
    email?: string;
    isVatSubject: boolean;
    creditLimit?: number;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateThirdPartyRequest {
    companyId: number;
    type: ThirdPartyType;
    name: string;
    taxId?: string;
    rccm?: string;
    address?: string;
    phone?: string;
    email?: string;
    isVatSubject: boolean;
    creditLimit?: number;
}

export interface UpdateThirdPartyRequest extends Partial<CreateThirdPartyRequest> {
    id: number;
}

export enum ProductType {
    GOODS = 'GOODS',
    SERVICE = 'SERVICE',
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    type: ProductType;
    salesPriceExclTax: number;
    purchasePriceExclTax: number;
    currentStock?: number;
    alertStock?: number;
    barcode?: string;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductRequest {
    companyId: number;
    sku: string;
    name: string;
    type: 'GOODS' | 'SERVICE';
    salesPriceExclTax: number;
    purchasePriceExclTax: number;
    currentStock?: number;
    alertStock?: number;
    barcode?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: number;
}

export type ThirdPartyListResponse = PaginatedResponse<ThirdParty> | ThirdParty[];
export type ProductListResponse = PaginatedResponse<Product> | Product[];
