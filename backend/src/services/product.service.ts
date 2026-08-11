import { prisma } from "../config/prisma.js";
import {
    MovementType
} from "../generated/prisma/client.js";

interface CreateProductInput {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    minimumStock: number;
    location: string;
}

export const createProduct = async (
    data: CreateProductInput
) => {
    return prisma.product.create({
        data: {
            name: data.name,
            sku: data.sku,
            category: data.category,
            unitPrice: data.unitPrice,
            minimumStock: data.minimumStock,
            location: data.location,
            currentStock: 0
        }
    });
};

interface GetProductsOptions {
    page: number;
    limit: number;
    search?: string;
    lowStock?: boolean;
}

export const getProducts = async ({
    page,
    limit,
    search,
    lowStock
}: GetProductsOptions) => {
    const skip = (page - 1) * limit;

    const where = {
        ...(search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: "insensitive" as const
                          }
                      },
                      {
                          sku: {
                              contains: search,
                              mode: "insensitive" as const
                          }
                      },
                      {
                          category: {
                              contains: search,
                              mode: "insensitive" as const
                          }
                      }
                  ]
              }
            : {}),

        ...(lowStock
            ? {
                  currentStock: {
                      lte: prisma.product.fields.minimumStock
                  }
              }
            : {})
    };

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        }),

        prisma.product.count({
            where
        })
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getProductById = async (id: number) => {
    return prisma.product.findUnique({
        where: {
            id
        },
        include: {
            stockMovements: {
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    }
                }
            }
        }
    });
};

interface UpdateProductInput {
    name?: string;
    sku?: string;
    category?: string;
    unitPrice?: number;
    minimumStock?: number;
    location?: string;
}

export const updateProduct = async (
    id: number,
    data: UpdateProductInput
) => {
    return prisma.product.update({
        where: {
            id
        },
        data
    });
};

interface StockMovementInput {
    productId: number;
    quantity: number;
    reason: string;
    createdById: number;
    type: MovementType;
}

export const createStockMovement = async (
    data: StockMovementInput
) => {
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: {
                id: data.productId
            }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        if (
            data.type === MovementType.OUT &&
            product.currentStock < data.quantity
        ) {
            throw new Error("Insufficient stock");
        }

        const newStock =
            data.type === MovementType.IN
                ? product.currentStock + data.quantity
                : product.currentStock - data.quantity;

        const movement = await tx.stockMovement.create({
            data: {
                productId: data.productId,
                quantity: data.quantity,
                type: data.type,
                reason: data.reason,
                createdById: data.createdById
            }
        });

        const updatedProduct = await tx.product.update({
            where: {
                id: data.productId
            },
            data: {
                currentStock: newStock
            }
        });

        return {
            movement,
            product: updatedProduct
        };
    });
};