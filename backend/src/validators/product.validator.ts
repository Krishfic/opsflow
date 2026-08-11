import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Product name must contain at least 2 characters"),

    sku: z
        .string()
        .trim()
        .min(1, "SKU is required"),

    category: z
        .string()
        .trim()
        .min(1, "Category is required"),

    unitPrice: z
        .coerce
        .number()
        .positive("Unit price must be greater than zero"),

    minimumStock: z
        .coerce
        .number()
        .int()
        .nonnegative("Minimum stock cannot be negative"),

    location: z
        .string()
        .trim()
        .min(1, "Location is required")
});

export const updateProductSchema = createProductSchema.partial();

export const stockMovementSchema = z.object({
    quantity: z
        .coerce
        .number()
        .int()
        .positive("Quantity must be greater than zero"),

    reason: z
        .string()
        .trim()
        .min(2, "Reason is required")
});