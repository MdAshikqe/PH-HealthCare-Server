import { Request, Response } from "express";
import { AdminService } from "./admin.servies";
import pick from "../../../shared/pick";
import { adminFilterableFields, adminPaginationFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";





const getAllDB= async(req:Request,res:Response)=>{
try {
    const filter=pick(req.query,adminFilterableFields);
    const options=pick(req.query,adminPaginationFields);


    const result= await AdminService.getAllDB(filter,options);
    // res.status(200).json({
    //     success:true,
    //     message:"Admin fetched successfully",
    //     metaData:result.metaData,
    //     data:result.data
    // });

     sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Admin fetched successfully",
        metaData:result.metaData,
        data:result.data 
    })
} catch (error) {
    res.status(500).json({
        success:false,
        message:(error as any)?.name || "Internal server error",
        error
    })
    
}
}


const getByIdFromDB= async(req:Request,res:Response)=>{
    const {id}=req.params;
   try {
    const result= await AdminService.getByIdFromDB(id);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Admin data fetched by id successfully ",
        data:result
    })
    // res.status(200).json({
    //     success:true,
    //     message:"Admin data fetched by id successfully ",
    //     data:result
    // })
    
   } catch (error) {
    res.status(500).json({
        success:false,
        message:(error as any)?.name || "Internal server error",
        error
    })
   }
};

const updateIntoDB= async(req:Request,res:Response)=>{
    const{id} =req.params;
    const data= req.body;
  
    try {
        const result= await AdminService.updateIntoDB(id,data);
        sendResponse(res,{
            statusCode:200,
            success:true,
            message:"Admin data updated successfully",
            data:result
        })
        // res.status(200).json({
        //     success:true,
        //     message:"Admin data updated successfully",
        //     data:result
        // })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: (error as Error).name || "Data updated failed",
            error
        })
        
    }

};

const deleteFromDB= async(req:Request,res:Response)=>{
    const { id } = req.params;
 try {
    const result= await AdminService.deleteFromDB(id);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Admin delete successfuly",
        data:result
    })
    
    // res.status(200).json({
    //     success:true,
    //     message:"Admin delete successfuly",
    //     data:result
    // })
    
 } catch (error) {
    res.status(500).json({
        success:false,
        message: (error as Error).name || "internal server error"
    })
    
 }

};

const softDeleteFromDB= async(req:Request,res:Response)=>{
    const {id}=req.params;
try {
    const result= await AdminService.softDeleteFromDB(id);
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Admin delete(softDelete) succesfuly",
        data:result
    })
    // res.status(200).json({
    //     success:true,
    //     message:"Admin delete(softDelete) succesfuly",
    //     data:result
    // })
} catch (error) {
    res.status(500).json({
        success:false,
        message: (error as any)?.name || "internal error",
        error
    })
    
}

}

export const AdminController={
    getAllDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}