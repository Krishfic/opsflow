import { Request, Response } from "express";
import {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    createStockMovement
} from "../services/product.service.js";
import { MovementType } from "../generated/prisma/client.js";

export const createProductController = async (
    req: Request,
    res: Response
) => {
    try {
        const product = await createProduct(req.body);

        return res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};

export const getProductsController = async (
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

        const lowStock =
            req.query.lowStock === "true";

        const result = await getProducts({
            page,
            limit,
            search,
            lowStock
        });

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

export const getProductController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};

export const updateProductController = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await updateProduct(
    id,
    req.body
);

if (!product) {
    return res.status(404).json({
        success: false,
        message: "Product not found"
    });
}

return res.status(200).json({
    success: true,
    product
});
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};

export const stockInController = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const productId = Number(req.params.id);

        if (!Number.isInteger(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const result = await createStockMovement({
            productId,
            quantity: req.body.quantity,
            reason: req.body.reason,
            createdById: req.user.userId,
            type: MovementType.IN
        });

        return res.status(201).json({
            success: true,
            message: "Stock added successfully",
            ...result
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to add stock"
        });
    }
};

export const stockOutController = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const productId = Number(req.params.id);

        if (!Number.isInteger(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const result = await createStockMovement({
            productId,
            quantity: req.body.quantity,
            reason: req.body.reason,
            createdById: req.user.userId,
            type: MovementType.OUT
        });

        return res.status(201).json({
            success: true,
            message: "Stock removed successfully",
            ...result
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to remove stock"
        });
    }
};