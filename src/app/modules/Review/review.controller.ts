import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../../shared/sendResponse";
import Httpstatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const result= await ReviewService.insertIntoDB(user as IAuthUser,req.body);

    sendResponse(res,{
        success:true,
        statusCode:Httpstatus.OK,
        message:"Review create successfully",
        data:result
    })
});

const getAllFromDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const options=pick(req.query,["page","limit","sortBy","sortOrder"])
    const filters=pick(req.query,["doctorEmail","patientEmail"])
    const result= await ReviewService.getAllFromDB(user as IAuthUser,options,filters);

    sendResponse(res,{
        success:true,
        statusCode:Httpstatus.OK,
        message:"Review retrive sucessfully",
        metaData:result.metaData,
        data:result.data
    })
})

export const ReviewController={
    insertIntoDB,
    getAllFromDB
}