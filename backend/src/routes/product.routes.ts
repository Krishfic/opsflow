import { Router } from "express";

import {
    createProductController,
    getProductController,
    getProductsController,
    updateProductController,
    stockInController,
    stockOutController
} from "../controllers/product.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    createProductSchema,
    updateProductSchema,
    stockMovementSchema
} from "../validators/product.validator.js";

import { Role } from "../generated/prisma/client.js";

const router = Router();

router.get(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.WAREHOUSE
    ),
    getProductsController
);

router.post(
    "/",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.WAREHOUSE
    ),
    validate(createProductSchema),
    createProductController
);

router.get(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.SALES,
        Role.WAREHOUSE
    ),
    getProductController
);

router.patch(
    "/:id",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.WAREHOUSE
    ),
    validate(updateProductSchema),
    updateProductController
);

router.post(
    "/:id/stock-in",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.WAREHOUSE
    ),
    validate(stockMovementSchema),
    stockInController
);

router.post(
    "/:id/stock-out",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.WAREHOUSE
    ),
    validate(stockMovementSchema),
    stockOutController
);

export default router;