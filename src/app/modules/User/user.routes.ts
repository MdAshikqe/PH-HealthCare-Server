import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { UserValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";



const router= express.Router();






router.post("/create-admin",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
   req.body = UserValidation.createAdmin.parse(JSON.parse(req.body.data))
   return UserController.createAdmin(req, res)
}

);


router.post("/create-doctor",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
fileUploader.upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
   req.body = UserValidation.createDoctor.parse(JSON.parse(req.body.data))
   return UserController.createDoctor(req, res,next)
}

);
router.post("/create-patient",
   fileUploader.upload.single('file'),
   (req:Request,res:Response,next:NextFunction)=>{
      req.body=UserValidation.createPatient.parse(JSON.parse(req.body.data))
      return UserController.createPatient(req,res,next)
   }
   );

router.get("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),UserController.getAllDB);
router.get("/my-profile",
auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),
UserController.getMyProfile);

router.patch("/:id/status",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validateRequest(UserValidation.updateStatus), UserController.updateStatus);

export const userRoutes=router;
