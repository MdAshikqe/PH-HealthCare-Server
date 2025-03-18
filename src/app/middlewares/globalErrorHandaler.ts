import { NextFunction, Request, Response } from "express";
import status from "http-status";

const globalErrorHandaler=(error:any,req:Request,res:Response,next:NextFunction)=>{
    res.status(status.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:error.message || "Something went worng",
        error:error
    })

};

export default globalErrorHandaler;