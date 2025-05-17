import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const insertIntoDB= catchAsync(async(req:Request,res:Response)=>{
    const user=req.user;
    const result= await DoctorScheduleServices.insertIntoDB(user,req.body);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Doctor schedule create successfully",
        data:result
    })
})

export const DoctorScheduleControllers={
    insertIntoDB
}