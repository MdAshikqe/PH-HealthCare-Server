import { PrismaClient, UserRole } from "@prisma/client";
const prisma=new PrismaClient();

const createAdmin= async(data:any)=>{
    const userData={
        email:data.admin.email,
        password:data.password,
        role:UserRole.ADMIN
    }

    const result= await prisma.$transaction(async (transactinClient)=>{
        await transactinClient.user.create({
            data:userData
        })
        const createAdminData= await transactinClient.admin.create({
            data:data.admin
        })
        return createAdminData;
    })
    return result;

}

export const userService={
    createAdmin
}