import { Router } from "express";
import {
    getCurrentUser,
    login,
    logout
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);

router.post("/logout", logout);

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

export default router;