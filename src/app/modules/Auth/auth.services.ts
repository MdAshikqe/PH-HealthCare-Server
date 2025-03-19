import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const generateToken = (payload:any, secret: string, expiresIn: string) => {
//     const token = jwt.sign(
//         payload,
//         secret,
//         {
//             expiresIn
//         }
//     );
//     return token;
// }

const login=async(payload:ILogin)=>{
    const userData= await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
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


    const refreshToken= jwt.sign({
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
        refreshToken,
        needPasswordChange:userData.needChangePassword

    };
};

const refreshToken=async(token:string)=>{
        let decodedData;
       try {
         decodedData = jwt.verify(token, "abcdef");
       } catch (error) {
         throw new Error("You are not authorized");
       }

       if (typeof decodedData !== "object" || !decodedData || !("email" in decodedData)) {
         throw new Error("Invalid token payload");
       }

       const userData = await prisma.user.findUniqueOrThrow({
         where: {
           email: decodedData?.email as string,
           status:UserStatus.ACTIVE
         }
       });

       const accessToken=jwt.sign({
        email:userData.email,
        role:userData.role
        },
        "abcd",
        {
            expiresIn:"5m"
        }
    );
    return {
        accessToken,
        needPasswordChange:userData.needChangePassword
    }
}


export const AuthServices={
    login,
    refreshToken
}