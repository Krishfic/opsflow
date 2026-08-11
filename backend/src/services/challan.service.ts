import { prisma } from "../config/prisma.js";
import {
    ChallanStatus,
    MovementType
} from "../generated/prisma/client.js";

const generateChallanNumber = async () => {
    const count = await prisma.challan.count();

    const nextNumber = count + 1;

    return `CH-${new Date().getFullYear()}-${String(nextNumber).padStart(6, "0")}`;
};

interface CreateChallanInput {
    customerId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
}

export const createChallan = async (
    data: CreateChallanInput,
    createdById: number
) => {
    const customer = await prisma.customer.findUnique({
        where: {
            id: data.customerId
        }
    });

    if (!customer) {
        throw new Error("Customer not found");
    }

    const productIds = data.items.map(
        (item) => item.productId
    );

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    if (products.length !== productIds.length) {
        throw new Error("One or more products were not found");
    }

    const productMap = new Map(
        products.map((product) => [
            product.id,
            product
        ])
    );

    const totalQuantity = data.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const challanNumber =
        await generateChallanNumber();

    const items = data.items.map((item) => {
        const product = productMap.get(item.productId)!;

        return {
            productId: product.id,
            productNameSnapshot: product.name,
            skuSnapshot: product.sku,
            unitPriceSnapshot: product.unitPrice,
            quantity: item.quantity
        };
    });

    return prisma.challan.create({
        data: {
            challanNumber,
            customerId: data.customerId,
            createdById,
            totalQuantity,
            status: ChallanStatus.DRAFT,
            items: {
                create: items
            }
        },
        include: {
            customer: true,
            items: true
        }
    });
};

export const confirmChallan = async (
    challanId: number,
    userId: number
) => {
    return prisma.$transaction(async (tx) => {
        const challan = await tx.challan.findUnique({
            where: {
                id: challanId
            },
            include: {
                items: true
            }
        });

        if (!challan) {
            throw new Error("Challan not found");
        }

        if (challan.status !== ChallanStatus.DRAFT) {
            throw new Error(
                "Only draft challans can be confirmed"
            );
        }

        for (const item of challan.items) {
            const product = await tx.product.findUnique({
                where: {
                    id: item.productId
                }
            });

            if (!product) {
                throw new Error(
                    `Product ${item.productId} not found`
                );
            }

            if (product.currentStock < item.quantity) {
                throw new Error(
                    `Insufficient stock for ${product.name}`
                );
            }
        }

        for (const item of challan.items) {
            const product = await tx.product.findUnique({
                where: {
                    id: item.productId
                }
            });

            if (!product) {
                throw new Error(
                    `Product ${item.productId} not found`
                );
            }

            await tx.product.update({
                where: {
                    id: product.id
                },
                data: {
                    currentStock:
                        product.currentStock -
                        item.quantity
                }
            });

            await tx.stockMovement.create({
                data: {
                    productId: product.id,
                    quantity: item.quantity,
                    type: MovementType.OUT,
                    reason: `Sales Challan ${challan.challanNumber}`,
                    createdById: userId
                }
            });
        }

        return tx.challan.update({
            where: {
                id: challan.id
            },
            data: {
                status: ChallanStatus.CONFIRMED
            },
            include: {
                customer: true,
                items: true
            }
        });
    });
};

export const cancelChallan = async (
    challanId: number
) => {
    const challan = await prisma.challan.findUnique({
        where: {
            id: challanId
        }
    });

    if (!challan) {
        throw new Error("Challan not found");
    }

    if (challan.status !== ChallanStatus.DRAFT) {
        throw new Error(
            "Only draft challans can be cancelled"
        );
    }

    return prisma.challan.update({
        where: {
            id: challanId
        },
        data: {
            status: ChallanStatus.CANCELLED
        }
    });
};

interface GetChallansOptions {
    page: number;
    limit: number;
    search?: string;
    status?: ChallanStatus;
}

export const getChallans = async ({
    page,
    limit,
    search,
    status
}: GetChallansOptions) => {
    const skip = (page - 1) * limit;

    const where = {
        ...(status ? { status } : {}),
        ...(search
            ? {
                  OR: [
                      {
                          challanNumber: {
                              contains: search,
                              mode: "insensitive" as const
                          }
                      },
                      {
                          customer: {
                              name: {
                                  contains: search,
                                  mode: "insensitive" as const
                              }
                          }
                      },
                      {
                          customer: {
                              businessName: {
                                  contains: search,
                                  mode: "insensitive" as const
                              }
                          }
                      }
                  ]
              }
            : {})
    };

    const [challans, total] =
        await prisma.$transaction([
            prisma.challan.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            businessName: true
                        }
                    },
                    items: true
                }
            }),

            prisma.challan.count({
                where
            })
        ]);

    return {
        challans,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getChallanById = async (
    challanId: number
) => {
    return prisma.challan.findUnique({
        where: {
            id: challanId
        },
        include: {
            customer: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            },
            items: true
        }
    });
};