import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserValidation } from "./user.validation";



const router= express.Router();





router.post("/",auth("ADMIN","SUPER_ADMIN"),
fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
   req.body = UserValidation.createAdmin.parse(JSON.parse(req.body.data))
   return UserController.createAdmin(req, res)
}

);

export const userRoutes=router;
