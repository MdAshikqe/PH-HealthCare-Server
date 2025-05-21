import express from "express"
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router= express.Router();

router.post("/",auth(UserRole.DOCTOR),DoctorScheduleControllers.insertIntoDB)
router.get("/my-schedule",auth(UserRole.DOCTOR),DoctorScheduleControllers.getMySchedule)
router.delete("/my-schedule/:id",auth(UserRole.DOCTOR),DoctorScheduleControllers.deleteFromDB)

export const DoctorScheduleRoutes=router;