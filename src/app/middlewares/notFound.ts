import { NextFunction, Request, Response } from "express";
import status from "http-status";

const notFound=(req:Request,res:Response,next:NextFunction)=>{
    res.status(status.INTERNAL_SERVER_ERROR).json({
        sucess:false,
        message:"API NOT FOUND",
        error:{
            path:req.originalUrl,
            message:"Your request path is not found"
        }
    })
}

export default notFound;