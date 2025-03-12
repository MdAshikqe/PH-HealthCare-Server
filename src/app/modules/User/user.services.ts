import { PrismaClient, UserRole } from "@prisma/client";
const prisma=new PrismaClient();
import bcrypt from 'bcrypt';

const createAdmin= async(data:any)=>{
    const hashPassword:string= await bcrypt.hash(data.password,12);

    const userData={
        email:data.admin.email,
        password:hashPassword,
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