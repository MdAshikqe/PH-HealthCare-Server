import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { IAuthUser } from "../../interfaces/common";

const createAppointment= catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;

    const result= await AppointmentService.createAppointment(user as IAuthUser,req.body);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Appointment booked succussfully",
        data:result
    })
})

export const AppointmentController={
    createAppointment
}