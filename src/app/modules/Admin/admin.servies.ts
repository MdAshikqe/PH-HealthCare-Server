import { Prisma } from "@prisma/client"
import { adminSearchFields } from "./admin.constant";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma";

// [
//     {
//         name:{
//             contains:params.searchTerm,
//             mode:"insensitive"
//         }
//     },
//     {
//         email:{
//             contains:params.searchTerm,
//             mode:"insensitive"
//         }
//     }
// ]




const getAllDB= async(params:any,options:any)=>{
    const {limit,skip,page}=PaginationHelpers.calculatePagination(options);
    const {searchTerm,...filterData}=params;

    const andConditions:Prisma.AdminWhereInput[]=[];
    if(params.searchTerm){
        andConditions.push({
            OR:adminSearchFields.map(field=>({
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
                    equals:filterData[key]
                }
            }))
        })
    }

    const whereCondition:Prisma.AdminWhereInput={AND:andConditions};

    const result= await prisma.admin.findMany({
        where:whereCondition,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:"desc"
        }
    });
    const total= await prisma.admin.count({
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

export const AdminService={
    getAllDB
}