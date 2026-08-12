import { Request, Response } from "express";
import {
    addFollowUp,
    createCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
    getCustomerFollowUps
} from "../services/customer.service.js";
import {
    CustomerStatus
} from "../generated/prisma/client.js";

export const createCustomerController = async (
    req: Request,
    res: Response
) => {
    try {
        const customer = await createCustomer(req.body);

        return res.status(201).json({
            success: true,
            customer
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create customer"
        });
    }
};

export const getCustomersController = async (
    req: Request,
    res: Response
) => {
    try {
        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : undefined;

        const rawStatus =
    typeof req.query.status === "string"
        ? req.query.status
        : undefined;

let status: CustomerStatus | undefined;

if (rawStatus) {
    if (
        !Object.values(CustomerStatus).includes(
            rawStatus as CustomerStatus
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer status"
        });
    }

    status = rawStatus as CustomerStatus;
}

        const result = await getCustomers({
            page,
            limit,
            search,status
        });

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch customers"
        });
    }
};

export const getCustomerController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });
        }

        const customer = await getCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            success: true,
            customer
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer"
        });
    }
};

export const updateCustomerController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });
        }

        const customer = await updateCustomer(id, req.body);

        return res.status(200).json({
            success: true,
            customer
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update customer"
        });
    }
};

export const addFollowUpController = async (
    req: Request,
    res: Response
) => {
    try {
        const customerId = Number(req.params.id);

        if (!Number.isInteger(customerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const followUp = await addFollowUp(
            customerId,
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            followUp
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to add follow-up"
        });
    }
};

export const getCustomerFollowUpsController =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const customerId =
                Number(req.params.id);

            if (
                !Number.isInteger(customerId)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid customer ID"
                });
            }

            const followUps =
                await getCustomerFollowUps(
                    customerId
                );

            return res.status(200).json({
                success: true,
                followUps
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch follow-ups"
            });
        }
    };