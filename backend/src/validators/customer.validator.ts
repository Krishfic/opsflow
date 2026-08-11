import { z } from "zod";
import { CustomerStatus, CustomerType } from "../generated/prisma/client.js";

export const createCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Customer name must contain at least 2 characters"),

    mobile: z
        .string()
        .trim()
        .min(10, "Mobile number must contain at least 10 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),

    businessName: z
        .string()
        .trim()
        .optional(),

    gstNumber: z
        .string()
        .trim()
        .optional(),

    customerType: z.nativeEnum(CustomerType),

    address: z
        .string()
        .trim()
        .min(3, "Address is required"),

    status: z
        .nativeEnum(CustomerStatus)
        .optional(),

    followUpDate: z
        .coerce
        .date()
        .optional(),

    notes: z
        .string()
        .trim()
        .optional()
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createFollowUpSchema = z.object({
    note: z
        .string()
        .trim()
        .min(1, "Follow-up note is required"),

    followUpDate: z
        .coerce
        .date()
});