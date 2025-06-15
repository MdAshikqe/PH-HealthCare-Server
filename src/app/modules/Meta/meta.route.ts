import express from "express"
import { MetaControllers } from "./meta.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router=express.Router();

router.get("/",
    auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),
    MetaControllers.fetchDashboardMetaData)

export const MetaRoutes=router;