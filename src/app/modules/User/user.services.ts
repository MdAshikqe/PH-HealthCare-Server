import {  UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpars/fileUploader";

const createAdmin= async(req:any)=>{
    const file=req.file;
    if(file){
        const uploadToCloudinary= await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto=uploadToCloudinary?.secure_url;
    }
    const hashPassword:string= await bcrypt.hash(req.body.password,12);

    const userData={
        email:req.body.admin.email,
        password:hashPassword,
        role:UserRole.ADMIN
    }

    const result= await prisma.$transaction(async (transactinClient)=>{
        await transactinClient.user.create({
            data:userData
        })
        const createAdminData= await transactinClient.admin.create({
            data:req.body.admin
        })
        return createAdminData;
    })
    return result;

}

export const UserService={
    createAdmin
}