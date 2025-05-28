import express from "express";
import { scheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router=express.Router();

router.post("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),scheduleControllers.insertIntoDB);

router.get("/",auth(UserRole.DOCTOR) ,scheduleControllers.getAllDB);
router.get("/:id",auth(UserRole.DOCTOR,UserRole.ADMIN,UserRole.SUPER_ADMIN),scheduleControllers.getByIdFromDB)
router.delete("/:id",auth(UserRole.DOCTOR,UserRole.ADMIN,UserRole.SUPER_ADMIN),scheduleControllers.deleteByIdFromDB)


export const SchedulesRouter= router;