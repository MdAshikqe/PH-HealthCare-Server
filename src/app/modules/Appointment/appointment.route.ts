import express from "express"
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router=express.Router();

router.post("/",auth(UserRole.PATIENT),AppointmentController.createAppointment)

router.get("/my-appointment",auth(UserRole.PATIENT,UserRole.DOCTOR),AppointmentController.getMyAppointment)

router.get("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AppointmentController.getAllFromDB)

router.patch("/status/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.DOCTOR) ,AppointmentController.changeAppointmentStatus)




export const AppointmentRoutes=router;