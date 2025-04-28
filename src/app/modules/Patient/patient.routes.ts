import express from "express"
import { PatientControllers } from "./patient.controller";

const router=express.Router();

router.get("/",PatientControllers.getAllDB);
router.get("/:id",PatientControllers.getByIdFromDB);
router.patch("/:id",PatientControllers.updateIntoDB);

export const PatientRouter=router;