import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { AuthServices } from "./auth.services"
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const login = catchAsync(async(req:Request,res:Response)=>{
    const data=req.body
    const result= await AuthServices.login(data);

    const {refreshToken}=result;
    res.cookie("refreshToken",refreshToken,{
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

});

const refreshToken=catchAsync(async(req:Request,res:Response)=>{
    const {refreshToken}=req.cookies;
    const result= await AuthServices.refreshToken(refreshToken)

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Refresh token are generate",
        data:result
    })

})


export const AuthController={
    login,
    refreshToken
}