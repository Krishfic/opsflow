import api from "./axios";

import type {
    ProductDetails,
    CreateProductData,
    UpdateProductData,
    ProductListResponse,
    ProductQueryParams,
    StockMovementData
} from "../types/product";

export const getProducts = async (
    params?: ProductQueryParams
): Promise<ProductListResponse> => {
    const response = await api.get(
        "/products",
        {
            params
        }
    );

    return response.data;
};

export const getProductById = async (
    id: number
): Promise<{
    success: boolean;
    product: ProductDetails;
}> => {
    const response = await api.get(
        `/products/${id}`
    );

    return response.data;
};

export const createProduct = async (
    data: CreateProductData
) => {
    const response = await api.post(
        "/products",
        data
    );

    return response.data;
};

export const updateProduct = async (
    id: number,
    data: UpdateProductData
) => {
    const response = await api.patch(
        `/products/${id}`,
        data
    );

    return response.data;
};

export const stockIn = async (
    productId: number,
    data: StockMovementData
) => {
    const response = await api.post(
        `/products/${productId}/stock-in`,
        data
    );

    return response.data;
};

export const stockOut = async (
    productId: number,
    data: StockMovementData
) => {
    const response = await api.post(
        `/products/${productId}/stock-out`,
        data
    );

    return response.data;
};