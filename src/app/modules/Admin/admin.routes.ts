import express from "express";
import { AdminController } from "./admin.controller";


const router =express.Router();

router.get("/",AdminController.getAllDB);

export const AdminRoutes=router;