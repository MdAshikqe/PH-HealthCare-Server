import express from "express"
import { DoctorController } from "./doctor.controller";

const router=express.Router();

router.get("/",DoctorController.getAllDB);
router.get("/:id",DoctorController.getByIdFromDB);
router.delete("/:id",DoctorController.deleteFromDB);

router.delete("/soft/:id",DoctorController.softDeleteFromDB);


export const DoctorRoute=router;