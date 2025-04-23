import express from "express"
import { PatientControllers } from "./patient.controller";

const router=express.Router();

router.get("/",PatientControllers.getAllDB)

export const PatientRouter=router;