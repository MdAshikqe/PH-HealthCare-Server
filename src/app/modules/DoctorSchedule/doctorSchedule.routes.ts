import express from "express"
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router= express.Router();

router.post("/doctor-schedule-create",auth(UserRole.DOCTOR),DoctorScheduleControllers.insertIntoDB)
router.get("/my-schedule",auth(UserRole.DOCTOR),DoctorScheduleControllers.getMySchedule)
router.delete("/my-schedule/:id",auth(UserRole.DOCTOR),DoctorScheduleControllers.deleteMyScheduleFromDB)
router.get("/",auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),DoctorScheduleControllers.getAllDoctorSchedule)

export const DoctorScheduleRoutes=router;