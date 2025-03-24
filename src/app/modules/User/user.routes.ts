import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";

const router= express.Router();





router.post("/",auth("ADMIN","SUPER_ADMIN"),
fileUploader.upload.single('file'),
UserController.createAdmin);

export const userRoutes=router;
