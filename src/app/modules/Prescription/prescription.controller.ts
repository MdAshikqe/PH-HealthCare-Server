import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import Httpstatus from "http-status";
import { PrescriptionService } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const result= await PrescriptionService.insertIntoDB(user as IAuthUser,req.body);

    sendResponse(res,{
        success:true,
        statusCode:Httpstatus.OK,
        message:"Priscription create successfully",
        data:result
    })
});

const patientPrescription=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const options=pick(req.query,["page","limit","sortBy","sortOrder"])
    const result= await PrescriptionService.patientPrescription(user as IAuthUser,options);

    sendResponse(res,{
        success:true,
        statusCode:Httpstatus.OK,
        message:"My priscripton retrive successfully",
        metaData:result.metaData,
        data:result.data
    })
})

export const PrescriptionController={
    insertIntoDB,
    patientPrescription
}