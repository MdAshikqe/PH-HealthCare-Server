import { Request } from "express"
import prisma from "../../../shared/prisma"
import { fileUploader } from "../../../helpars/fileUploader";
import { IFile } from "../../interfaces/common";



const insertInToDB=async(req:Request)=>{
    const file= req.file as IFile;
    if(file){
        const uploadToCloudinary=await fileUploader.uploadToCloudinary(file)
        req.body.icon=uploadToCloudinary?.secure_url;
    }
    const result = await prisma.specialties.create({
        data:req.body
    })
    return result;
};

const getAllSpecialties=async()=>{
    const result= await prisma.specialties.findMany();

    return result;
}

const getByIdFromDB= async(id:string)=>{
        const result= await prisma.specialties.findUniqueOrThrow({
            where:{
                id
            }
        })
        return result;
}

const deleteFromDB= async(id:string)=>{
    const result= await prisma.specialties.delete({
        where:{
            id
        }
    })
    return result;
}


export const SpecialteService={
    insertInToDB,
    getAllSpecialties,
    getByIdFromDB,
    deleteFromDB

}