export type MovementType = "IN" | "OUT";

export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    unitPrice: string | number;
    currentStock: number;
    minimumStock: number;
    location: string;
    createdAt: string;
    updatedAt: string;
}

export interface StockMovement {
    id: number;
    productId: number;
    quantity: number;
    type: MovementType;
    reason: string;
    createdById: number;
    createdAt: string;
    createdBy: {
        id: number;
        name: string;
        role: string;
    };
}

export interface ProductDetails
    extends Product {
    stockMovements: StockMovement[];
}

export interface CreateProductData {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    minimumStock: number;
    location: string;
}

export type UpdateProductData =
    Partial<CreateProductData>;

export interface ProductListResponse {
    success: boolean;
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    lowStock?: boolean;
}

export interface StockMovementData {
    quantity: number;
    reason: string;
}