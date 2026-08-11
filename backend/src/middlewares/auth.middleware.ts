import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/client.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const payload = verifyToken(token);

        if (!Object.values(Role).includes(payload.role as Role)) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        req.user = {
            userId: payload.userId,
            role: payload.role as Role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};