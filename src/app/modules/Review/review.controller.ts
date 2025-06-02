import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../../shared/sendResponse";
import Httpstatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const result= await ReviewService.insertIntoDB(user as IAuthUser,req.body);

    sendResponse(res,{
        success:true,
        statusCode:Httpstatus.OK,
        message:"Review create successfully",
        data:result
    })
})

export const ReviewController={
    insertIntoDB
}