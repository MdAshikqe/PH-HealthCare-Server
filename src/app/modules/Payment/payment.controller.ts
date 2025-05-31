import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const initPayment=catchAsync(async(req:Request,res:Response)=>{
    const {appointmentId}=req.params;
    const result= await PaymentService.initPayment(appointmentId);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Successfully initate payment",
        data:result
    })
})

export const PaymentController={
    initPayment,
}