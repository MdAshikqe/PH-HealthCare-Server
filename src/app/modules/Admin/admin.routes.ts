import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import{ AnyZodObject, string, z } from "zod"
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router =express.Router();





router.get("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getAllDB);
router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getByIdFromDB);

router.patch(
    "/:id", 
    auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
    validateRequest(adminValidationSchema.update),
    AdminController.updateIntoDB);
router.delete("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.deleteFromDB);
router.delete("/softD/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.softDeleteFromDB);

export const AdminRoutes=router;