import express from "express"
import { DoctorController } from "./doctor.controller";

const router=express.Router();

router.get("/",DoctorController.getAllDB);
router.get("/:id",DoctorController.getByIdFromDB);


export const DoctorRoute=router;