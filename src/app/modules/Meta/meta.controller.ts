import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { MetaServices } from "./meta.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardMetaData=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
        const user=req.user;
        const result=await MetaServices.fetchDashboardMetaData(user as IAuthUser);

        sendResponse(res,{
            success:true,
            statusCode:status.OK,
            message:"Meta data successfully retrive",
            data:result
        })
})

export const MetaControllers={
    fetchDashboardMetaData
}