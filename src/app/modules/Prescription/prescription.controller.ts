import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import Httpstatus from "http-status";
import { PrescriptionService } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const result= await PrescriptionService.insertIntoDB(user as IAuthUser,req.body);

    sendResponse(res,{
        success:true,
        statusCode:Httpstatus.OK,
        message:"Priscription create successfully",
        data:result
    })
})

export const PrescriptionController={
    insertIntoDB
}