import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken"
import config from "../../config";

const auth=(...roles:string[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
       try {
            const token=req.headers.authorization;
            console.log({token});
            if(!token){
                throw new Error("You are not authorized")
            }
            const verifyUser=jwt.verify(token,config.jwt.access_token_secret as Secret)
            if (roles.length && typeof verifyUser !== "string" && !roles.includes(verifyUser.role)) {
                throw new Error("You are not authrized")
            }
            next()
        
       } catch (error) {
        next(error)
        
       }

    }


}

export default auth;