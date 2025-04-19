import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialteService } from "./specialtie.service";


const insertInToDB=catchAsync(async(req,res)=>{
    const result=await SpecialteService.insertInToDB(req);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully insert specialties data",
        data:result
    })
});

const getAllSpecialties= catchAsync(async(req,res)=>{
    const result= await SpecialteService.getAllSpecialties();

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully retrive all data",
        data:result
    })
});

const getByIdFromDB= catchAsync(async(req,res)=>{
    const {id}=req.params;
    const result= await SpecialteService.getByIdFromDB(id);

    sendResponse(res,{
        success:true,
        statusCode:status.OK,
        message:"Succesfully get by id",
        data:result
    })
})

const deleteFromDB= catchAsync(async(req,res)=>{
    const {id}=req.params;
    const result= await SpecialteService.deleteFromDB(id);

    sendResponse(res,{
            statusCode:status.OK,
            success:true,
            message:"Successfully delete from DB",
            data:result
    })
})

export const SpecialteController={
    insertInToDB,
    getAllSpecialties,
    getByIdFromDB,
    deleteFromDB
}