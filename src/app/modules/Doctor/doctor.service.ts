import { Prisma } from "@prisma/client";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma"
import { doctorSearchableFields } from "./doctor.constants";

const getAllDB= async(filters:any,options:any)=>{
        const {page,limit,skip}=PaginationHelpers.calculatePagination(options)
        const {searchTerm,...filterData}=filters;

        const andConditions:Prisma.DoctorWhereInput[]=[];

        if(filters.searchTerm){
            andConditions.push({
                OR:doctorSearchableFields.map(field=>({
                    [field]:{
                        contains:filters.searchTerm,
                        mode:"insensitive"
                    }
                }))
            })
        }

        if (Object.keys(filterData).length > 0) {
            const filterConditions = Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            }));
            andConditions.push(...filterConditions);
        }

        andConditions.push({
            isDeleted:false
        })

        const whereCondition:Prisma.DoctorWhereInput=andConditions.length > 0 ? { AND: andConditions } : {};


          const result= await prisma.doctor.findMany({
            where:whereCondition,
            skip,
            take:limit,
            orderBy:options.sortBy && options.sortOrder ? {
                [options.sortBy]:options.sortOrder
            }:{
                createdAt:"desc"

            },
            });
            
            const total= await prisma.doctor.count({
                where:whereCondition
            })

            return{
                metaData:{
                    page,
                    limit,
                    total
                },
                data:result
            };

};

const getByIdFromDB=async(id:string)=>{
    const result= await prisma.doctor.findUniqueOrThrow({
        where:{
            id
        }
    })
        return result;
}

export const DoctorServies={
    getAllDB,
    getByIdFromDB
}