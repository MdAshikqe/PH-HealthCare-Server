import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const insertIntoDB=catchAsync(async(req:Request,res:Response)=>{

    const result= await ScheduleServices.insertIntoDB(req.body);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"schedule succesfuly insert to DB",
        data:result
    })
});

export const scheduleControllers={
    insertIntoDB
}