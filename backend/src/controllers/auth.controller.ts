import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { loginUser } from "../services/auth.service.js";

const isProduction =
    process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction
        ? ("none" as const)
        : ("strict" as const),
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000
};

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }

        const result = await loginUser({
            email,
            password
        });

        res.cookie(
            "accessToken",
            result.token,
            cookieOptions
        );

        return res.status(200).json({
            success: true,
            user: result.user
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Authentication failed"
        });
    }
};

export const getCurrentUser = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required"
            });
        }

        const user =
            await prisma.user.findUnique({
                where: {
                    id: req.user.userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch current user"
        });
    }
};

export const logout = (
    req: Request,
    res: Response
) => {
    res.clearCookie(
        "accessToken",
        {
            httpOnly: true,
            sameSite: isProduction
                ? ("none" as const)
                : ("strict" as const),
            secure: isProduction
        }
    );

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};