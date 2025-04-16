import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import { SpecialteController } from "./specialtie.controller";
import { SpecialtiesValidation } from "./specialtie.validation";

const router=express.Router();

router.post("/", 
    fileUploader.upload.single('file'),
    (req:Request,res:Response,next:NextFunction)=>{
        req.body=SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecialteController.insertInToDB(req,res,next)
}
)

export const SpecialteRoutes= router;