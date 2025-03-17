import {Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.servies";
import pick from "../../../shared/pick";
import { adminFilterableFields, adminPaginationFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../shared/catchAsync";



const getAllDB:RequestHandler= catchAsync(async(req,res)=>{

        const filter=pick(req.query,adminFilterableFields);
        const options=pick(req.query,adminPaginationFields);

        const result= await AdminService.getAllDB(filter,options);

         sendResponse(res,{
            statusCode:status.OK,
            success:true,
            message:"Admin fetched successfully",
            metaData:result.metaData,
            data:result.data 
        })
    })


const getByIdFromDB:RequestHandler= catchAsync(async(req,res)=>{
    const {id}=req.params;
    const result= await AdminService.getByIdFromDB(id);
    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Admin data fetched by id successfully ",
        data:result
    })
    // res.status(200).json({
    //     success:true,
    //     message:"Admin data fetched by id successfully ",
    //     data:result
    // })
    
   })

const updateIntoDB= catchAsync(async(req:Request,res:Response)=>{
    const{id} =req.params;
    const data= req.body;

        const result= await AdminService.updateIntoDB(id,data);
        sendResponse(res,{
            statusCode:status.OK,
            success:true,
            message:"Admin data updated successfully",
            data:result
        })
        // res.status(200).json({
        //     success:true,
        //     message:"Admin data updated successfully",
        //     data:result
        // })
        
    })

const deleteFromDB= catchAsync(async(req:Request,res:Response)=>{
    const { id } = req.params;
    const result= await AdminService.deleteFromDB(id);
    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Admin delete successfuly",
        data:result
    })
    
    // res.status(200).json({
    //     success:true,
    //     message:"Admin delete successfuly",
    //     data:result
    // })
    

})

const softDeleteFromDB= catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result= await AdminService.softDeleteFromDB(id);
    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Admin delete(softDelete) succesfuly",
        data:result
    })
    // res.status(200).json({
    //     success:true,
    //     message:"Admin delete(softDelete) succesfuly",
    //     data:result
    // })


})

export const AdminController={
    getAllDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}