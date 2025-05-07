import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { PatientServices } from "./patient.service"
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import pick from "../../../shared/pick";
import { patientFilterAbleFields, patientPaginationFields } from "./patient.constant";

const getAllDB=catchAsync(async(req:Request,res:Response)=>{
    const filter=pick(req.query,patientFilterAbleFields)
    const options=pick(req.query,patientPaginationFields)

    const result= await PatientServices.getAllDB(filter,options);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Patient data retrive successfully",
        metaData:result.metaData,
        data:result.data
    })

});

const getByIdFromDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result= await PatientServices.getByIdFromDB(id);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully get by id",
        data:result
    })
});

const updateIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result= await PatientServices.updateIntoDB(id,req.body);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully updated patient",
        data:result
    })

});


const deleteIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result= await PatientServices.deleteIntoDB(id);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Deleted sussefully patinet data",
        data:result
    })

});

const softDeleteIntoDB= catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result= await PatientServices.softDeleteIntoDB(id);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Soft deleted successfully",
        data:result
    })
})

export const PatientControllers={
    getAllDB,
    getByIdFromDB,
    updateIntoDB,
    deleteIntoDB,
    softDeleteIntoDB
}