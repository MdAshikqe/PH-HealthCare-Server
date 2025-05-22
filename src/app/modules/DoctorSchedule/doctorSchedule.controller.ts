import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB= catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const result= await DoctorScheduleServices.insertIntoDB(user,req.body);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Doctor schedule create successfully",
        data:result
    })
});

const getMySchedule=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const filter= pick(req.query,["startDateTime","endDateTime","isBooked"])
    const options=pick(req.query,['limit', 'page', 'sortBy', 'sortOrder'])
    const user=req.user;
    const result= await DoctorScheduleServices.getMySchedule(filter,options,user as IAuthUser );

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Get my profile retrive successfully",
        metaData:result.metaData,
        data:result.data
    })
});

const deleteMyScheduleFromDB= catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{
    const user=req.user;
    const {id}=req.params;
    const result=await DoctorScheduleServices.deleteMyScheduleFromDB(user as IAuthUser,id);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Doctor schedule delete from db",
        data:result
    })
});

const getAllDoctorSchedule=catchAsync(async(req:Request,res:Response)=>{
    const filters=pick(req.query,['searchTerm', 'isBooked', 'doctorId'])
    const options=pick(req.query,['limit', 'page', 'sortBy', 'sortOrder'])
    const result= await DoctorScheduleServices.getAllDoctorSchedule(filters,options);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"All doctor schedule retrive successfully",
        metaData:result.metaData,
        data:result.data
    })
})

export const DoctorScheduleControllers={
    insertIntoDB,
    getMySchedule,
    deleteMyScheduleFromDB,
    getAllDoctorSchedule
}