import { Prisma } from "@prisma/client";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma"

const getAllDB=async(filter:any,options:any)=>{
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options)

    const andConditions:Prisma.PatientWhereInput[]=[];

    const whereCondition:Prisma.PatientWhereInput=andConditions.length>0 ? {AND:andConditions}:{};
    const result= await prisma.patient.findMany({
        where:whereCondition,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:"desc"
        }
    }
);
        const total= await prisma.patient.count({
            where:whereCondition
        })

    return {
        metaData:{
            page,
            limit,
            total
        },
        data:result
    };
}


export const PatientServices={
    getAllDB
}