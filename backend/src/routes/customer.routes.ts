import { Router } from "express";
import {
    addFollowUpController,
    createCustomerController,
    getCustomerController,
    getCustomerFollowUpsController,
    getCustomersController,
    updateCustomerController
} from "../controllers/customer.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createCustomerSchema,
    updateCustomerSchema,
    createFollowUpSchema
} from "../validators/customer.validator.js";

import { Role } from "../generated/prisma/client.js";

const router = Router();

router.get(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.ACCOUNTS
    ),
    getCustomersController
);

router.post(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES
    ),
    validate(createCustomerSchema),
    createCustomerController
);

router.get(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.ACCOUNTS
    ),
    getCustomerController
);

router.patch(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES
    ),
    validate(updateCustomerSchema),
    updateCustomerController
);

router.post(
    "/:id/follow-ups",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES
    ),
    validate(createFollowUpSchema),
    addFollowUpController
);

router.get(
    "/:id/follow-ups",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.ACCOUNTS
    ),
    getCustomerFollowUpsController
);

export default router;