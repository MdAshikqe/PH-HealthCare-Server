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


const getByIdFromDB= async(req:Request,res:Response)=>{
    const {id}=req.params;
   try {
    const result= await AdminService.getByIdFromDB(id);
    res.status(200).json({
        success:true,
        message:"Admin data fetched by id successfully ",
        data:result
    })
    
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
        res.status(200).json({
            success:true,
            message:"Admin data updated successfully",
            data:result
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: (error as Error).name || "Data updated failed",
            error
        })
        
    }

}


export const AdminController={
    getAllDB,
    getByIdFromDB,
    updateIntoDB
}