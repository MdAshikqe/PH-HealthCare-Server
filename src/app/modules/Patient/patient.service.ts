import { Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma"
import { patientSearchAbleFields } from "./patient.constant";
import { IPatientUpdateInfo } from "./patient.interface";


const getAllDB=async(filters:any,options:any)=>{
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options);
    const {searchTerm,...filterData}=filters;
    

    const andConditions:Prisma.PatientWhereInput[]=[];

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
};

const getByIdFromDB=async(id:string):Promise<Patient | null>=>{
    const result= await prisma.patient.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false

            
        },
        include:{
            medicalReport:true,
            patientHealthData:true
        }
        
    })

    return result;
};

const updateIntoDB= async(id:string,payload:Partial<IPatientUpdateInfo>)=>{
    const {healthData,medicalReport,...patientData}=payload;

    const patientInfo= await prisma.patient.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
            
        }
    })

        await prisma.$transaction(async(transtionClint)=>{
                await transtionClint.patient.update({
            where:{
                id:patientInfo.id
            },
            data:patientData,
        });

        if(healthData){
          const updateAndCreate=  await transtionClint.patientHealthData.upsert({
                where:{
                    patientId:patientInfo.id
                },
                update:healthData,
                create:{...healthData,patientId:patientInfo.id}
                
            })
        };
        if(medicalReport){
            const updateAndCreate= await transtionClint.medicalReport.create({
                data:{...medicalReport,patientId:patientInfo.id}
            })
        }
    });


    const response= await prisma.patient.findUniqueOrThrow({
        where:{
            id:patientInfo.id
        },
        include:{
            patientHealthData:true,
            medicalReport:true
        }
    })

    return response;

};

const deleteIntoDB=async(id:string)=>{
    await prisma.patient.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })
    const result= await prisma.$transaction(async(tx)=>{
                 await tx.medicalReport.deleteMany({
            where:{
                patientId:id
            }
        });

            await tx.patientHealthData.delete({
            where:{
                patientId:id
            }
        });

        const deletePatient= await tx.patient.delete({
            where:{
                id
            }
        })

             await tx.user.delete({
            where:{
                email:deletePatient.email
            }
        })
        return deletePatient;
    })
    return result;
};

const softDeleteIntoDB=async(id:string)=>{
        await prisma.patient.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })

    const result= await prisma.$transaction(async(tx)=>{

        const softPatinet= await tx.patient.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        })
                 await tx.user.update({
            where:{
                email:softPatinet.email
            },  
            data:{
                status:UserStatus.DELETED
            }
        })
        return softPatinet;
    })
    return result;
}




export const PatientServices={
    getAllDB,
    getByIdFromDB,
    updateIntoDB,
    deleteIntoDB,
    softDeleteIntoDB
}