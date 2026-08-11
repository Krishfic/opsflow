import express from "express";
import { prisma } from "./config/prisma.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "OpsFlow API is running"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const userCount = await prisma.user.count();

        res.status(200).json({
            success: true,
            message: "OpsFlow API and database are healthy",
            database: {
                connected: true,
                userCount
            }
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

export default app;