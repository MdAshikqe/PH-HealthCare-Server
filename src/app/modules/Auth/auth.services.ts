import prisma from "../../../shared/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const login=async(payload:ILogin)=>{
    const userData= await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email
        }
    });
    const isCorrectPassword:boolean=await bcrypt.compare(payload.password,userData.password);
    if(!isCorrectPassword){
        throw new Error("Password Incorrected")  
    }

    const accessToken= jwt.sign({
        email:userData.email,
        role:userData.role
        },
        "abcd", 
        {
            algorithm:"HS256",
            expiresIn:"5m"
        }
);
    const refressToken= jwt.sign({
        email:userData.email,
        role:userData.role
        },
        "abcdef", 
        {
            algorithm:"HS256",
            expiresIn:"15d"
        }
);


    return {
        accessToken,
        refressToken,
        needPasswordChange:userData.needChangePassword

    };
}


export const AuthServices={
    login
}