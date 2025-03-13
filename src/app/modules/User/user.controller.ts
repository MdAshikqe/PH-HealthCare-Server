import { Request, Response } from "express"
import { UserService } from "./user.services";


const createAdmin= async(req:Request,res:Response)=>{
  try {
    const result= await UserService.createAdmin(req.body);
    res.status(200).json({
        success:true,
        message:"Admin created successfully",
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


export const UserController={
    createAdmin
}

