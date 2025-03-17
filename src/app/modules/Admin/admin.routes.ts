import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import{ AnyZodObject, string, z } from "zod"
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";


const router =express.Router();





router.get("/",AdminController.getAllDB);
router.get("/:id",AdminController.getByIdFromDB);

router.patch("/:id", 
    validateRequest(adminValidationSchema.update),
    AdminController.updateIntoDB);
router.delete("/:id",AdminController.deleteFromDB);
router.delete("/softD/:id",AdminController.softDeleteFromDB);

export const AdminRoutes=router;