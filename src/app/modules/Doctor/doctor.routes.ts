import express from "express"
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { doctorValidations } from "./doctor.validation";

const router=express.Router();

router.get("/",DoctorController.getAllDB);
router.get("/:id",DoctorController.getByIdFromDB);
router.delete("/:id",
    auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
    DoctorController.deleteFromDB);

router.delete("/soft/:id",
    auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
    DoctorController.softDeleteFromDB);

router.patch("/:id",DoctorController.updateIntoDB);


export const DoctorRoute=router;