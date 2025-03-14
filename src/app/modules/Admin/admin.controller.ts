import { Request, Response } from "express";
import { AdminService } from "./admin.servies";
import pick from "../../../shared/pick";
import { adminFilterableFields, adminPaginationFields } from "./admin.constant";



const getAllDB= async(req:Request,res:Response)=>{
try {
    const filter=pick(req.query,adminFilterableFields);
    const options=pick(req.query,adminPaginationFields);

    // console.log({options});

    const result= await AdminService.getAllDB(filter,options);
    res.status(200).json({
        success:true,
        message:"Admin fetched successfully",
        metaData:result.metaData,
        data:result.data
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