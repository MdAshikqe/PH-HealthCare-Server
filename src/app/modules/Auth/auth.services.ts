import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { ILogin } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiErrors";
import status from "http-status";
import { urlencoded } from "express";
import emailSender from "./emailSender";

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
};

const changePassword= async(user:any,payload:any)=>{
    const userData= await prisma.user.findUniqueOrThrow({
        where:{
            email:user.email,
            status:UserStatus.ACTIVE
        }
    })

    const isCorrectPassword=await bcrypt.compare(payload.oldPassword,userData.password)
    if(!isCorrectPassword){
        throw new ApiError(status.UNAUTHORIZED,"Password does not match",'')
    }

    const hashPassword= await bcrypt.hash(payload.newPassword,10)

     await prisma.user.update({
        where:{
            email:userData.email
        },
        data:{
            password:hashPassword,
            needChangePassword:false
        }
    })
    return {
        message:"succesfully change password"
    }
    
    
};

const forgotPassword=async(payload:{email:string})=>{
    const userData= await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    })

 

    const resetPassToken=jwt.sign({
        email:userData.email,role:userData.role
    },
      config.jwt.reset_pass_token_secret as Secret,
      
        {
            algorithm:"HS256",
            expiresIn: config.jwt.reset_pass_token_expires_in as string
        }
)

//--------reset password link---------
//http://localhost:3000/reset-pass?id=22222222333333&token=asdhdfjfjdfjl;
const resetPassLink=config.reset_pass_link+`?id=${userData.id}&token=${resetPassToken}`;
    await emailSender(userData.email, 
    `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4CAF50;">Hello, Welcome to Our Service!</h2>
          <p>Please reset password in and change your password for security.</p>
          <a href=${resetPassLink} style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"><button>Reset Password</button></a>
          <p>Best Regards,<br> Your Team</p>
        </div>`
)


};

const resetPassword= async(token:string,payload:any)=>{
    const userData=await prisma.user.findUniqueOrThrow({
        where:{
            id:payload.id,
            status:UserStatus.ACTIVE
        }
    })

    const isValidToken= jwt.verify(token,config.jwt.reset_pass_token_secret as Secret);
    if(!isValidToken){
        throw new ApiError(status.FORBIDDEN,"Forbidden password","")
    }

    const hashPassword=await bcrypt.hash(payload.password,10)

    await prisma.user.update({
        where:{
            id:userData.id
        },
        data:{
            password:hashPassword,
            needChangePassword:false
        }
    });
    return{
        message:"Successfully reset password"
    }

};


export const AuthServices={
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}