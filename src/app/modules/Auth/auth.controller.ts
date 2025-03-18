import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { AuthServices } from "./auth.services"
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const login = catchAsync(async(req:Request,res:Response)=>{
    const data=req.body
    const result= await AuthServices.login(data);

    const {refressToken}=result;
    res.cookie("refressToken",refressToken,{
        secure:false,
        httpOnly:true
    })

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Login successfully",
        data:{
            accessToken:result.accessToken,
            needPasswordChange:result.needPasswordChange
        }
    })

})


export const AuthController={
    login
}