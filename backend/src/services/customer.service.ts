import { prisma } from "../config/prisma.js";
import {
    CustomerStatus,
    CustomerType
} from "../generated/prisma/client.js";

interface CreateCustomerInput {
    name: string;
    mobile: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType: CustomerType;
    address: string;
    status?: CustomerStatus;
    followUpDate?: Date;
    notes?: string;
}

export const createCustomer = async (
    data: CreateCustomerInput
) => {
    return prisma.customer.create({
        data
    });
};

interface GetCustomersOptions {
    page: number;
    limit: number;
    search?: string;
}

export const getCustomers = async ({
    page,
    limit,
    search
}: GetCustomersOptions) => {
    const skip = (page - 1) * limit;

    const where = search
        ? {
              OR: [
                  {
                      name: {
                          contains: search,
                          mode: "insensitive" as const
                      }
                  },
                  {
                      mobile: {
                          contains: search,
                          mode: "insensitive" as const
                      }
                  },
                  {
                      businessName: {
                          contains: search,
                          mode: "insensitive" as const
                      }
                  }
              ]
          }
        : {};

    const [customers, total] = await prisma.$transaction([
        prisma.customer.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        }),

        prisma.customer.count({
            where
        })
    ]);

    return {
        customers,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getCustomerById = async (id: number) => {
    return prisma.customer.findUnique({
        where: {
            id
        },
        include: {
            followUps: {
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

export const updateCustomer = async (
    id: number,
    data: Partial<CreateCustomerInput>
) => {
    return prisma.customer.update({
        where: {
            id
        },
        data
    });
};

export const addFollowUp = async (
    customerId: number,
    createdById: number,
    data: {
        note: string;
        followUpDate: Date;
    }
) => {
    return prisma.customerFollowUp.create({
        data: {
            customerId,
            createdById,
            note: data.note,
            followUpDate: data.followUpDate
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
    });
};