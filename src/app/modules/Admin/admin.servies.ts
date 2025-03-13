import { Prisma, PrismaClient } from "@prisma/client"
const prisma= new PrismaClient();
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

const getAllDB= async(params:any)=>{
    const {searchTerm,...filterData}=params;

    const andConditions:Prisma.AdminWhereInput[]=[];
    const adminSearchFields=["name","email"];
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
        where:whereCondition
    });
    return result;
}

export const AdminService={
    getAllDB
}