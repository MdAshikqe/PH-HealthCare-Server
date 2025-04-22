import { Prisma, UserStatus } from "@prisma/client";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma"
import { doctorSearchableFields } from "./doctor.constants";


const getAllDB= async(filters:any,options:any)=>{
        const {page,limit,skip}=PaginationHelpers.calculatePagination(options)
        const {searchTerm,specialties,...filterData}=filters;

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
            // doctor-doctorSpcialtie--specialtie-title
        if(specialties && specialties.length >0){
            andConditions.push({
                doctorSpecialties:{
                    some:{
                        specialties:{
                            title:{
                                contains:specialties,
                                mode:"insensitive"
                            }
                        }
                    }
                }
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
            include:{
                doctorSpecialties:{
                    include:{
                        specialties:true
                    }
                }
            }
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
            id,
            isDeleted:false
        }
    })
        return result;
};

const deleteFromDB=async(id:string)=>{
         await prisma.doctor.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    });

    const result=await prisma.$transaction(async(transtionClient)=>{
        const deleteDoctorData= await transtionClient.doctor.delete({
            where:{
                id,
            }
        })

         await transtionClient.user.delete({
            where:{
                email:deleteDoctorData?.email
            }
        })
        return deleteDoctorData;
    })
    return result;
};

const softDeleteFromDB=async(id:string)=>{
    await prisma.doctor.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })
    const result= await prisma.$transaction(async(transactionClient)=>{

        const doctorSoftDelete= await transactionClient.doctor.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        })
        const userSoftDelete=await transactionClient.user.update({
            where:{
                email:doctorSoftDelete.email
            },
            data:{
                status:UserStatus.DELETED
            }
        })
        return doctorSoftDelete;

    })
    return result;
}

const updateIntoDB=async(id:string,payload:any)=>{
    const {specialties,...doctorData}=payload;
    const doctorInfo= await prisma.doctor.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })

    const result= await prisma.$transaction(async(transtionClient)=>{
        const updateDoctorData= await prisma.doctor.update({
            where:{
                id,
                isDeleted:false
            },
            data:doctorData,
            include:{
                doctorSpecialties:true
            }
        });

        if(specialties && specialties.length>0){
            const deleteSpecialtieIds= specialties.filter(specialty=>specialty.isDeleted)
            for(const specialtie of deleteSpecialtieIds){
                const deleteDoctorSpecialties= await prisma.doctorSpecialties.deleteMany({
                    where:{
                        doctorId:doctorInfo.id,
                        specialitiesId:specialtie.specialtiesId
                    }
                
                
                })
            }

            const createSpecialtieIds= specialties.filter(specialty=>!specialty.isDeleted)
            for(const specialtie of createSpecialtieIds){
                const createDoctorSpecialties= await prisma.doctorSpecialties.create({
                    data:{
                        doctorId:doctorInfo.id,
                        specialitiesId:specialtie.specialtiesId
                    }
                
                })
            }

        }
        
    })

    const response= await prisma.doctor.findUniqueOrThrow({
        where:{
            id:doctorInfo.id
        },
        include:{
            doctorSpecialties:{
                include:{
                    specialties:true
                }
            }
        }
    })


    return response;
}

export const DoctorServies={
    getAllDB,
    getByIdFromDB,
    deleteFromDB,
    softDeleteFromDB,
    updateIntoDB
}