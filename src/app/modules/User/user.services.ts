import {  Patient, Prisma, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpars/fileUploader";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import { userSearchableFields } from "./user.constant";


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

const createDoctor=async(req:any)=>{
    const file=req.file;
    if(file){
        const uploadToCloudinary= await fileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto=uploadToCloudinary?.secure_url;
    }
    const hashPassword:string= await bcrypt.hash(req.body.password,12);

    const userData={
        email:req.body.doctor.email,
        password:hashPassword,
        role:UserRole.DOCTOR
    }

    const result= await prisma.$transaction(async (transactinClient)=>{
        await transactinClient.user.create({
            data:userData
        })
        const createDoctorData= await transactinClient.doctor.create({
            data:req.body.doctor
        })
        return createDoctorData;
    })
    return result;
}

const createPatient=async(req:any):Promise<Patient>=>{
    const file=req.file;
    if(file){
        const uploadToCloudinary= await fileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto=uploadToCloudinary?.secure_url;
    }
    const hashPassword= await bcrypt.hash(req.body.password,12);
    const userData= {
        email:req.body.patient.email,
        password:hashPassword,
        role:UserRole.PATIENT
    }
    const result= await prisma.$transaction(async (transcationClient)=>{
        await transcationClient.user.create({
            data:userData
        })
        const createPatientData= await transcationClient.patient.create({
            data:req.body.patient
        })
        return createPatientData
    })
    return result;
}

const getAllDB= async(params:any,options:any)=>{
        const {limit,page,skip}=PaginationHelpers.calculatePagination(options);
        const {searchTerm,...filterData}=params;

        const andConditions:Prisma.UserWhereInput[]=[]
        if(params.searchTerm){
            andConditions.push({
                OR:userSearchableFields.map(field=>({
                    [field]:{
                        contains:params.searchTerm,
                        mode:"insensitive"
                    }
                }))
            })
        }
        if(Object.keys(filterData).length>0){
            andConditions.push({
                AND:Object.keys(filterData).map(key=>({
                    [key]:{
                        equals:(filterData as any)[key]
                    }
                }))
            })
        };

        const whereCondition:Prisma.UserWhereInput={AND:andConditions};

        const result= await prisma.user.findMany({
            where:whereCondition,
            skip,
            take:limit,
            orderBy:options.sortBy && options.sortOrder ? {
                [options.sortBy]:options.sortOrder
            }:{
                createdAt:"desc"
            },
            select:{
                id:true,
                email:true,
                status:true,
                needChangePassword:true,
                role:true,
                createdAt:true,
                updatedAt:true
            }
        });
        
        const total=await prisma.user.count({
            where:whereCondition
        })

        return{
            metaData:{
                page,
                limit,
                total
            },
            data:result
        }
   
}

export const UserService={
    createAdmin,
    createDoctor,
    createPatient,
    getAllDB
}