import express from "express";
import { scheduleControllers } from "./schedule.controller";

const router=express.Router();

router.post("/",scheduleControllers.insertIntoDB)


export const SchedulesRouter= router;