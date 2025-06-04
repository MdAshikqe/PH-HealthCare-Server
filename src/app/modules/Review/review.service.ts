import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from "@prisma/client"
import prisma from "../../../shared/prisma"
import { IAuthUser } from "../../interfaces/common"
import ApiError from "../../errors/ApiErrors"
import Httpstatus from "http-status"
import { IPagination } from "../../interfaces/pagination"
import { PaginationHelpers } from "../../../helpars/paginationHelpars"


const insertIntoDB=async(user:IAuthUser,payload:any)=>{
    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
    const appointmentData= await prisma.appointment.findFirstOrThrow({
        where:{
            id:payload.appointmentId,
            paymentStatus:PaymentStatus.PAID,
            status:AppointmentStatus.COMPLETED
        },
        include:{
            doctor:true,
            patient:true
        }
    })

    if(user?.role === UserRole.PATIENT){
        if(!(user.email === patientData.email)){
            throw new ApiError(Httpstatus.BAD_REQUEST,"This is not your appointment","")
        }
    }

    return  await prisma.$transaction(async(tx)=>{
        const result=await tx.review.create({
        data:{
            patientId:appointmentData.patientId,
            doctorId:appointmentData.doctorId,
            appointmentId:appointmentData.id,
            rating:payload.rating,
            comment:payload.comment
        },
    })
        const avergRating= await tx.review.aggregate({
            _avg:{
                rating:true
            }
        })
        console.log(avergRating)

        await tx.doctor.update({
            where:{
                id:result.doctorId
            },
            data:{
                averageRating:avergRating._avg.rating as number
            }
        })
        return result;
    })
};

const getAllFromDB= async(user:IAuthUser,options:IPagination,filters:any)=>{
    
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options)
    const {doctorEmail,patientEmail}=filters;

    const andCondition:Prisma.ReviewWhereInput[]=[]

    if(doctorEmail){
        andCondition.push({
            doctor:{
                email:doctorEmail
            }
        })
    }
    if(patientEmail){
        andCondition.push({
            patient:{
                email:patientEmail
            }
        })
    }

    const whereCondition:Prisma.ReviewWhereInput=andCondition.length>0 ? {AND:andCondition}:{}


    if(!(user?.role === UserRole.ADMIN || UserRole.SUPER_ADMIN)){
            throw new ApiError(Httpstatus.BAD_REQUEST,"Do not access","")
    }

    const result= await prisma.review.findMany({
        where:whereCondition,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? 
        {[options.sortBy]:options.sortOrder}:{createdAt:"desc"},
        include:{
            doctor:true,
            patient:true
        }
    })
    const total= await prisma.review.count({
        where:whereCondition
    })

    return {
        metaData:{
            page,
            limit,
            total
        },
        data:result
    }
}

export const ReviewService={
    insertIntoDB,
    getAllFromDB
}