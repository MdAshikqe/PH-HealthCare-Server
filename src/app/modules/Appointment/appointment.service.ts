import prisma from "../../../shared/prisma"
import { IAuthUser } from "../../interfaces/common"
import { v4 as uuidv4 } from "uuid";
import { IPagination } from "../../interfaces/pagination";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

const createAppointment=async(user:IAuthUser,payload:any)=>{
   const patientData= await prisma.patient.findUniqueOrThrow({
    where:{
        email:user?.email
    }
   });

   const doctorData= await prisma.doctor.findUniqueOrThrow({
    where:{
        id:payload.doctorId
    }
   })

   const doctorScheduler= await prisma.doctorSchedules.findFirstOrThrow({
    where:{
        doctorId:doctorData.id,
        scheduleId:payload.scheduleId,
        isBooked:false
    }
   })

   const videoCallingId=uuidv4()

const result= await prisma.$transaction(async(tx)=>{
    const appointmentData= await tx.appointment.create({
    data:{
        patientId:patientData.id,
        doctorId:doctorData.id,
        scheduleId:payload.scheduleId,
        videoCallingId
    },
    include:{
        doctor:true,
        patient:true,
        schedule:true,
        payment:true
    }
   })

   await tx.doctorSchedules.update({
    where:{
        doctorId_scheduleId:{
            doctorId:doctorData.id,
            scheduleId:payload.scheduleId
        },
        
    },
    data:{
        isBooked:true,
        appointmentId:appointmentData.id
    }
   })

   const today=new Date();
   const transactionId="PH-HERO-"+today.getFullYear()+"-"+today.getMonth()+"-"+today.getDay()+"-"+today.getHours()+"-"+today.getMinutes()+"-"+today.getSeconds()+"-"+today.getMilliseconds();

   await tx.payment.create({
    data:{
        appointmentId:appointmentData.id,
        amount:doctorData.appointmentFee,
        transactionId
    }
   })

   return appointmentData;


})
   return result;

};

const getMyAppointment=async(user:IAuthUser,filters:any,options:IPagination)=>{
    const {page,limit,skip}=PaginationHelpers.calculatePagination(options)
    const {...filterData}=filters;
    
    const andConditions:Prisma.AppointmentWhereInput[]=[];

            if(user?.role === UserRole.PATIENT){
            andConditions.push({
                patient:{
                    email:user?.email
                }
            })
            }
            else if(user?.role === UserRole.DOCTOR){
                andConditions.push({
                    doctor:{
                        email:user?.email
                    }
                })
            }

    if(Object.keys(filterData).length>0){
        const filterConditions=Object.keys(filterData).map(key=>({
            [key]:{
                equals:(filterData as any)[key]
            }
        }))
        andConditions.push(...filterConditions)

    }

    const whereCondition:Prisma.AppointmentWhereInput=andConditions.length >0 ? {AND:andConditions}:{};

    const result= await prisma.appointment.findMany({
        where:whereCondition,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{createAt:"desc"},
        include:user?.role === UserRole.PATIENT ?
        {doctor:true,schedule:true}: {patient:{include:{medicalReport:true,patientHealthData:true,}},schedule:true}
    });

    const total= await prisma.appointment.count({
        where:whereCondition
    })

    return{
        metaData:{
            total,
            page,
            limit
        },
        data:result
    }
}

const getAllFromDB=async(user:IAuthUser,filters:any,options:IPagination)=>{
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options);
    const {patientEmail, doctorEmail,...filterData}=filters;
    
    const andConditions:Prisma.AppointmentWhereInput[]=[];

    if(patientEmail){
        andConditions.push({
            patient:{
                email:patientEmail
            }
        })
    }
    else if(doctorEmail){
        andConditions.push({
            doctor:{
                email:doctorEmail
            }
        })
    }

    if(Object.keys(filterData).length >0){
        andConditions.push({
            AND:Object.keys(filterData).map(key=>({
                [key]:{
                    equals:(filterData as any)[key]
                }
            }))
        })
    }

    const whereCondition:Prisma.AppointmentWhereInput=andConditions.length >0 ?{AND:andConditions}:{};

    const result= await  prisma.appointment.findMany({
        where:whereCondition,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createAt:"desc"
        },
        include:{
            doctor:true,
            patient:true
        }
    })
    const total= await prisma.appointment.count({
        where:whereCondition
    })
    return {
        metaData:{
            total,
            page,
            limit
        },
        data:result
    }
};

const changeAppointmentStatus=async(appointmentId:string,status:AppointmentStatus,user:IAuthUser)=>{
      const appointmentData= await prisma.appointment.findFirstOrThrow({
        where:{
            id:appointmentId
        },
        include:{
            doctor:true
        }
    })

    if(user?.role === UserRole.DOCTOR){
        if(!(user.email === appointmentData.doctor.email)){
            throw new ApiError(httpStatus.BAD_REQUEST,"This is not your appointment","")
        }
    }

    const result= await prisma.appointment.update({
        where:{
            id:appointmentId
        },
        data:{
            status
        },
        include:{
            doctor:true,
            patient:true,
            payment:true
        }
    });
    return result;

}

export const AppointmentService={
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus
}