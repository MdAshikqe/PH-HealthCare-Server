import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import { SpecialteController } from "./specialtie.controller";
import { SpecialtiesValidation } from "./specialtie.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router=express.Router();

router.post("/", 
    fileUploader.upload.single('file'),
    (req:Request,res:Response,next:NextFunction)=>{
        req.body=SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecialteController.insertInToDB(req,res,next)
}
);

router.get("/",SpecialteController.getAllSpecialties);

router.get("/:id", SpecialteController.getByIdFromDB);

router.delete("/:id", 
    auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
    SpecialteController.deleteFromDB);

export const SpecialteRoutes= router;