import { Request, Response } from "express";
import { AdminService } from "./admin.servies"

const getAllDB= async(req:Request,res:Response)=>{
try {
    const result= await AdminService.getAllDB(req.query);
    res.status(200).json({
        success:true,
        message:"Admin fetched successfully",
        data:result
    });
} catch (error) {
    res.status(500).json({
        success:false,
        message:(error as any)?.name || "Internal server error",
        error
    })
    
}
}


export const AdminController={
    getAllDB
}