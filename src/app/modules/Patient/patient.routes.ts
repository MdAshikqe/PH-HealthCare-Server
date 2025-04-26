import express from "express"
import { PatientControllers } from "./patient.controller";

const router=express.Router();

router.get("/",PatientControllers.getAllDB);
router.get("/:id",PatientControllers.getByIdFromDB);

export const PatientRouter=router;