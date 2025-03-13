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

    const whereCondition:Prisma.AdminWhereInput={AND:andConditions};

    const result= await prisma.admin.findMany({
        where:whereCondition
    });
    return result;
}

export const AdminService={
    getAllDB
}