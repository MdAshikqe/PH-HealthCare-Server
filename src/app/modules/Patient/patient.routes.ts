import express from "express"
import { PatientControllers } from "./patient.controller";

const router=express.Router();

router.get("/",PatientControllers.getAllDB);
router.get("/:id",PatientControllers.getByIdFromDB);
router.patch("/:id",PatientControllers.updateIntoDB);
router.delete("/:id",PatientControllers.deleteIntoDB);
router.delete("/softDelete/:id",PatientControllers.softDeleteIntoDB)

export const PatientRouter=router;