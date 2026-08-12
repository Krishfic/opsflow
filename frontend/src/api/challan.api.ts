import api from "./axios";

export interface ChallanItemInput {
    productId: number;
    quantity: number;
}

export interface CreateChallanData {
    customerId: number;
    items: ChallanItemInput[];
}

export const getChallans = async (
    params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }
) => {
    const response = await api.get(
        "/challans",
        { params }
    );

    return response.data;
};

export const getChallan = async (
    id: number
) => {
    const response = await api.get(
        `/challans/${id}`
    );

    return response.data;
};

export const createChallan = async (
    data: CreateChallanData
) => {
    const response = await api.post(
        "/challans",
        data
    );

    return response.data;
};

export const confirmChallan = async (
    id: number
) => {
    const response = await api.post(
        `/challans/${id}/confirm`
    );

    return response.data;
};

export const cancelChallan = async (
    id: number
) => {
    const response = await api.post(
        `/challans/${id}/cancel`
    );

    return response.data;
};