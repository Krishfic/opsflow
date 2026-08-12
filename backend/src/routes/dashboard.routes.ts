import { Router } from "express";

import {
    getDashboardController
} from "../controllers/dashboard.controller.js";

import {
    authenticate
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getDashboardController
);

export default router;