import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../../config";

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
        config.jwt.access_token_secret as string, 
        {
            algorithm:"HS256",
            expiresIn:config.jwt.access_token_expires_in as string,
        }
);


    const refreshToken= jwt.sign({
        email:userData.email,
        role:userData.role
        },
        config.jwt.refresh_token_secret as Secret, 
        {
            algorithm:"HS256",
            expiresIn:config.jwt.refresh_token_expires_in
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
        config.jwt.access_token_secret as Secret,
        {
            algorithm:"HS256",
            expiresIn:config.jwt.access_token_expires_in
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