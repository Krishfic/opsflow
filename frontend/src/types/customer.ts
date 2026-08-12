export type CustomerType =
    | "WHOLESALE"
    | "RETAIL";

export type CustomerStatus =
    | "LEAD"
    | "ACTIVE"
    | "INACTIVE";

export interface Customer {
    id: number;
    name: string;
    mobile: string;
    email: string | null;
    businessName: string | null;
    gstNumber: string | null;
    customerType: CustomerType;
    address: string;
    status: CustomerStatus;
    followUpDate: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerData {
    name: string;
    mobile: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType: CustomerType;
    address: string;
    status?: CustomerStatus;
    followUpDate?: string;
    notes?: string;
}

export type UpdateCustomerData =
    Partial<CreateCustomerData>;

export interface CustomerPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface CustomerListResponse {
    success: boolean;
    customers: Customer[];
    pagination: CustomerPagination;
}

export interface CustomerFollowUp {
    id: number;
    customerId: number;
    createdById: number;
    note: string;
    followUpDate: string;
    createdAt: string;
    createdBy: {
        id: number;
        name: string;
        role: string;
    };
}