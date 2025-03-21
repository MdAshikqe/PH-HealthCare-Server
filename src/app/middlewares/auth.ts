import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken"
import config from "../../config";
import ApiError from "../errors/ApiErrors";
import status from "http-status";

const auth=(...roles:string[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
       try {
            const token=req.headers.authorization;
            if(!token){
                throw new ApiError(status.UNAUTHORIZED, "You are not authorized","")
            }
            const verifyUser=jwt.verify(token,config.jwt.access_token_secret as Secret)
            if (roles.length && typeof verifyUser !== "string" && !roles.includes(verifyUser.role)) {
                throw new ApiError(status.FORBIDDEN,"forbidden",'')
            }
            next()
        
       } catch (error) {
        next(error)
        
       }

    }


}

export default auth;