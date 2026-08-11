import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./config/prisma.js";
import { Role } from "./generated/prisma/client.js";

const users = [
    {
        name: "System Admin",
        email: "admin@opsflow.local",
        password: "Admin@123",
        role: Role.ADMIN
    },
    {
        name: "Sales User",
        email: "sales@opsflow.local",
        password: "Sales@123",
        role: Role.SALES
    },
    {
        name: "Warehouse User",
        email: "warehouse@opsflow.local",
        password: "Warehouse@123",
        role: Role.WAREHOUSE
    },
    {
        name: "Accounts User",
        email: "accounts@opsflow.local",
        password: "Accounts@123",
        role: Role.ACCOUNTS
    }
];

const seed = async () => {
    for (const user of users) {
        const passwordHash = await bcrypt.hash(user.password, 12);

        await prisma.user.upsert({
            where: {
                email: user.email
            },
            update: {
                passwordHash,
                role: user.role,
                name: user.name
            },
            create: {
                name: user.name,
                email: user.email,
                passwordHash,
                role: user.role
            }
        });
    }

    console.log("Users seeded successfully");
};

seed()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });