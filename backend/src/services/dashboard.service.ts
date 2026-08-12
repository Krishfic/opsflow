import { prisma } from "../config/prisma.js";
import { Role } from "../generated/prisma/client.js";

export const getAdminDashboard = async () => {
    const now = new Date();

    const lowStockResult =
        await prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(*)::bigint AS count
            FROM "Product"
            WHERE "currentStock" <= "minimumStock"
        `;

    const lowStockProducts =
        Number(lowStockResult[0]?.count ?? 0);

    const [
        totalCustomers,
        totalProducts,
        totalChallans,
        recentCustomers,
        recentStockMovements,
        recentChallans
    ] = await prisma.$transaction([
        prisma.customer.count(),

        prisma.product.count(),

        prisma.challan.count(),

        prisma.customer.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        }),

        prisma.stockMovement.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        }),

        prisma.challan.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        businessName: true
                    }
                }
            }
        })
    ]);

    return {
        role: Role.ADMIN,

        stats: {
            totalCustomers,
            totalProducts,
            lowStockProducts,
            totalChallans
        },

        recentCustomers,
        recentStockMovements,
        recentChallans
    };
};


export const getSalesDashboard = async () => {
    const now = new Date();

    const [
        totalCustomers,
        leadCustomers,
        upcomingFollowUps,
        recentCustomers,
        recentChallans
    ] = await prisma.$transaction([
        prisma.customer.count(),

        prisma.customer.count({
            where: {
                status: "LEAD"
            }
        }),

        prisma.customerFollowUp.count({
            where: {
                followUpDate: {
                    gte: now
                }
            }
        }),

        prisma.customer.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        }),

        prisma.challan.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        businessName: true
                    }
                }
            }
        })
    ]);

    return {
        role: Role.SALES,

        stats: {
            totalCustomers,
            leadCustomers,
            upcomingFollowUps
        },

        recentCustomers,
        recentChallans
    };
};


export const getWarehouseDashboard = async () => {
    const lowStockResult =
        await prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(*)::bigint AS count
            FROM "Product"
            WHERE "currentStock" <= "minimumStock"
        `;

    const lowStockProducts =
        Number(lowStockResult[0]?.count ?? 0);

    const [
        totalProducts,
        recentStockMovements
    ] = await prisma.$transaction([
        prisma.product.count(),

        prisma.stockMovement.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 10,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        })
    ]);

    return {
        role: Role.WAREHOUSE,

        stats: {
            totalProducts,
            lowStockProducts
        },

        recentStockMovements
    };
};


export const getAccountsDashboard = async () => {
    const [
        totalChallans,
        draftChallans,
        confirmedChallans,
        cancelledChallans,
        recentChallans
    ] = await prisma.$transaction([
        prisma.challan.count(),

        prisma.challan.count({
            where: {
                status: "DRAFT"
            }
        }),

        prisma.challan.count({
            where: {
                status: "CONFIRMED"
            }
        }),

        prisma.challan.count({
            where: {
                status: "CANCELLED"
            }
        }),

        prisma.challan.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 10,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        businessName: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        })
    ]);

    return {
        role: Role.ACCOUNTS,

        stats: {
            totalChallans,
            draftChallans,
            confirmedChallans,
            cancelledChallans
        },

        recentChallans
    };
};