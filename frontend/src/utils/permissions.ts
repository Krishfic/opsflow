import type { UserRole } from "../features/auth/authSlice";

export const canCreateProduct = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "WAREHOUSE"
    );
};

export const canEditProduct = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "WAREHOUSE"
    );
};

export const canManageStock = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "WAREHOUSE"
    );
};

export const canViewProducts = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "SALES" ||
        role === "WAREHOUSE"
    );
};

export const canCreateCustomer = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "SALES"
    );
};

export const canEditCustomer = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "SALES"
    );
};

export const canCreateChallan = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "SALES"
    );
};

export const canConfirmChallan = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "SALES"
    );
};

export const canCancelChallan = (
    role: UserRole
) => {
    return (
        role === "ADMIN" ||
        role === "SALES"
    );
};