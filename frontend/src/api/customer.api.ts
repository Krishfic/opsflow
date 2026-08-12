import api from "./axios";

import type {
    Customer,
    CustomerListResponse,
    CreateCustomerData,
    UpdateCustomerData,
    CustomerFollowUp
} from "../types/customer";

export interface GetCustomersParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export const getCustomers = async (
    params?: GetCustomersParams
): Promise<CustomerListResponse> => {
    const response = await api.get(
        "/customers",
        {
            params
        }
    );

    return response.data;
};

export const getCustomerById = async (
    id: number
): Promise<{
    success: boolean;
    customer: Customer;
}> => {
    const response = await api.get(
        `/customers/${id}`
    );

    return response.data;
};

export const createCustomer = async (
    data: CreateCustomerData
) => {
    const response = await api.post(
        "/customers",
        data
    );

    return response.data;
};

export const updateCustomer = async (
    id: number,
    data: UpdateCustomerData
) => {
    const response = await api.patch(
        `/customers/${id}`,
        data
    );

    return response.data;
};

export const getCustomerFollowUps =
    async (
        customerId: number
    ): Promise<{
        success: boolean;
        followUps: CustomerFollowUp[];
    }> => {
        const response = await api.get(
            `/customers/${customerId}/follow-ups`
        );

        return response.data;
    };


export interface CreateFollowUpData {
    note: string;
    followUpDate: string;
}

export const addCustomerFollowUp =
    async (
        customerId: number,
        data: CreateFollowUpData
    ) => {
        const response = await api.post(
            `/customers/${customerId}/follow-ups`,
            data
        );

        return response.data;
    };
