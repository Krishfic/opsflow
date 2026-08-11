import { z } from "zod";

const challanItemSchema = z.object({
    productId: z
        .coerce
        .number()
        .int()
        .positive(),

    quantity: z
        .coerce
        .number()
        .int()
        .positive("Quantity must be greater than zero")
});

export const createChallanSchema = z.object({
    customerId: z
        .coerce
        .number()
        .int()
        .positive("Customer is required"),

    items: z
        .array(challanItemSchema)
        .min(1, "At least one product is required")
});

export const updateChallanStatusSchema = z.object({
    status: z.enum(["CONFIRMED", "CANCELLED"])
});