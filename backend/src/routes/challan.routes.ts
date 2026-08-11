import { Router } from "express";

import {
    cancelChallanController,
    confirmChallanController,
    createChallanController,
    getChallanController,
    getChallansController
} from "../controllers/challan.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { Role } from "../generated/prisma/client.js";

import {
    createChallanSchema
} from "../validators/challan.validator.js";

const router = Router();

router.get(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.ACCOUNTS
    ),
    getChallansController
);

router.post(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES
    ),
    validate(createChallanSchema),
    createChallanController
);

router.get(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.ACCOUNTS
    ),
    getChallanController
);

router.post(
    "/:id/confirm",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES
    ),
    confirmChallanController
);

router.post(
    "/:id/cancel",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES
    ),
    cancelChallanController
);

export default router;