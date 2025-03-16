import { Admin, Prisma, UserStatus} from "@prisma/client"
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
    };

    andConditions.push({
        isDeleted:false
    })

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
};

const getByIdFromDB= async(id:string):Promise<Admin | null>=>{
    const result= await prisma.admin.findUnique({
        where:{
            id,
            isDeleted:false
        }
    })
    return result;
};

const updateIntoDB= async(id:string,data:Partial<Admin>):Promise<Admin>=>{
    //is exit
     await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })

    const result= await prisma.admin.update({
        where:{
            id
        },
        data
    })
    return result;
};

const deleteFromDB= async(id:string):Promise<Admin |null>=>{
    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    })
    const result= await prisma.$transaction(async(transactionClient)=>{
        const deleteAdminData= await transactionClient.admin.delete({
            where:{
                id
            } 
        });
        const deleteUserData= await transactionClient.user.delete({
            where:{
                email:deleteAdminData.email
            }
        });
        return deleteAdminData;

    })
    return result;
}

const softDeleteFromDB= async(id:string)=>{
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })
    const result=await prisma.$transaction(async(transactionClient)=>{
        const adminSoftDelete= await transactionClient.admin.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        })
        const userSoftDelete=await transactionClient.user.update({
            where:{
                email:adminSoftDelete.email
            },
            data:{
                status:UserStatus.DELETED
              
            }
        })
    })
    return result;
}

export const AdminService={
    getAllDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}