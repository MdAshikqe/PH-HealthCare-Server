import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createAppointment= catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;

    const result= await AppointmentService.createAppointment(user as IAuthUser,req.body);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Appointment booked succussfully",
        data:result
    })
});

const getMyAppointment=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const filters=pick(req.query,["status","paymentStatus"])
    const options=pick(req.query,["page","limit","sortBy","sortOrder"])
    const result= await AppointmentService.getMyAppointment(user as IAuthUser,filters,options);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"My appointment retrive successfully",
        metaData:result.metaData,
        data:result.data
        
    })
});

const getAllFromDB=catchAsync(async(req:Request &{user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const filters=pick(req.query,['status','paymentStatus','patientEmail','doctorEmail']);
    const options=pick(req.query,['limit', 'page', 'sortBy', 'sortOrder'])
    const result=await AppointmentService.getAllFromDB(user as IAuthUser,filters,options);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"All appointment are retrive",
        metaData:result.metaData,
        data:result.data
    })
});

const changeAppointmentStatus=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const {id}=req.params;
    const {status}=req.body;
    const user=req.user;
    const result= await AppointmentService.changeAppointmentStatus(id,status,user as IAuthUser);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Appointment change successfully",
        data:result
    })
})

export const AppointmentController={
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus
}