import express from "express";
import { scheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router=express.Router();

router.post("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),scheduleControllers.insertIntoDB);

router.get("/",scheduleControllers.getAllDB)


export const SchedulesRouter= router;