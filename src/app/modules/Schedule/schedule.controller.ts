import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleServices } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";


const insertIntoDB=catchAsync(async(req:Request,res:Response)=>{

    const result= await ScheduleServices.insertIntoDB(req.body);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"schedule succesfuly insert to DB",
        data:result
    })
});


const getAllDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const filter=pick(req.query,["startDateTime","endDateTime"])
    const options=pick(req.query,["page","limit","sortBy","sortOrder"])
    const user=req.user;
    const result= await ScheduleServices.getAllDB(filter,options,user);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Schedule are succsfully all retrive",
        metaData:result.metaData,
        data:result.data
    })
})

export const scheduleControllers={
    insertIntoDB,
    getAllDB
}