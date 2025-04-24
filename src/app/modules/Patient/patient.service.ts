import { Prisma } from "@prisma/client";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma"
import { patientSearchAbleFields } from "./patient.constant";


const getAllDB=async(filters:any,options:any)=>{
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options);
    const {searchTerm,...filterData}=filters;
    

    const andConditions:Prisma.PatientWhereInput[]=[];
    console.log(andConditions)

    if(searchTerm){
        andConditions.push({
            OR:patientSearchAbleFields.map(field=>({
                [field]:{
                    contains:filters.searchTerm,
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
    }


    const whereCondition:Prisma.PatientWhereInput=andConditions.length>0 ? {AND:andConditions}:{};
    console.log('======',whereCondition)
    const result= await prisma.patient.findMany({
        where:whereCondition,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:"desc"
        },
        include:{
            medicalReport:true,
            patientHealthData:true
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