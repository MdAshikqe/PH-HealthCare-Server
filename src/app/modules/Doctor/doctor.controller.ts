import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorServies } from "./doctor.service";
import pick from "../../../shared/pick";
import { doctorFilterAbleFields, doctorPaginationFields } from "./doctor.constants";
import { Request, Response } from "express";


const getAllDB= catchAsync(async(req:Request,res:Response)=>{
    const filter= pick(req.query,doctorFilterAbleFields)
    const options=pick(req.query,doctorPaginationFields)

    const result= await DoctorServies.getAllDB(filter,options);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully retrive all data",
        metaData:result.metaData,
        data:result.data
    })
});

const getByIdFromDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result= await DoctorServies.getByIdFromDB(id);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully get by id",
        data:result
    })
})

export const DoctorController={
    getAllDB,
    getByIdFromDB
}