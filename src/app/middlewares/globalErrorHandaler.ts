import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

const globalErrorHandaler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    let httpCode=status.INTERNAL_SERVER_ERROR;
    let success=false;
    let message=err.message || "Something went worng";
    let error=err;

    if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code==="P2025"){
            message="Not found";
            error=err.meta
        }
    }

    if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(err.code==="P2002"){
                message="Duplicate key error";
                error=err.meta
            }
    }

    res.status(httpCode).json({
        success,
        message,
        error
    })

};

export default globalErrorHandaler;