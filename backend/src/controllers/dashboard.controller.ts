import { Request, Response } from "express";

import {
    getAdminDashboard,
    getSalesDashboard,
    getWarehouseDashboard,
    getAccountsDashboard
} from "../services/dashboard.service.js";

import { Role } from "../generated/prisma/client.js";

export const getDashboardController = async (
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

        let dashboard;

        switch (req.user.role) {
            case Role.ADMIN:
                dashboard =
                    await getAdminDashboard();
                break;

            case Role.SALES:
                dashboard =
                    await getSalesDashboard();
                break;

            case Role.WAREHOUSE:
                dashboard =
                    await getWarehouseDashboard();
                break;

            case Role.ACCOUNTS:
                dashboard =
                    await getAccountsDashboard();
                break;

            default:
                return res.status(403).json({
                    success: false,
                    message: "Dashboard access denied"
                });
        }

        return res.status(200).json({
            success: true,
            dashboard
        });
    } catch (error) {
        console.error(
            "Dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard"
        });
    }
};