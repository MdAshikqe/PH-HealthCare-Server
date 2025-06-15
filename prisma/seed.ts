import { UserRole } from "@prisma/client"
import prisma from "../src/shared/prisma"
import bcryt from "bcrypt"

const seedSuperAdmin=async()=>{
try {
        const isExistSuperAdmin= await prisma.user.findFirstOrThrow({
        where:{
            role:UserRole.SUPER_ADMIN
        }
    })
    if(isExistSuperAdmin){
        console.log("Super Admin already exits")
        return
    }
    const hashPassword= await bcryt.hash("superAdmin",12)
    const superAdmin= await prisma.user.create({
        data:{
            email:"superAdmin@gmail.com",
            password:hashPassword,
            role:UserRole.SUPER_ADMIN,
            admin:{
                create:{
                    name:"super Admin",
                    contactNumber:"01772441612"
                }
            }
        }
    })
    console.log("Successfully create super admin",superAdmin)
    
} catch (error) {
    console.error(error)
    
}
finally{
    await prisma.$disconnect();
}
}

seedSuperAdmin();