import { AppointmentStatus, PaymentStatus} from "@prisma/client"
import prisma from "../../../shared/prisma"
import { IAuthUser } from "../../interfaces/common"
import ApiError from "../../errors/ApiErrors"
import Httpstatus from "http-status"
import { PaginationHelpers } from "../../../helpars/paginationHelpars"
import { IPagination } from "../../interfaces/pagination"

const insertIntoDB=async(user:IAuthUser,payload:any)=>{
const appointmentData= await prisma.appointment.findUniqueOrThrow({
    where:{
        id:payload.appointmentId,
        paymentStatus:PaymentStatus.PAID,
        status:AppointmentStatus.COMPLETED
          },
    include:{
        doctor:true
           }
   })
        if(!(user?.email ===appointmentData.doctor.email)){
            throw new ApiError(Httpstatus.BAD_REQUEST,"This is not your appointment","")
        }
    const result= await prisma.prescription.create({
        data:{
            appointmentId:appointmentData.id,
            doctorId:appointmentData.doctorId,
            patientId:appointmentData.patientId,
            instructions:payload.instructions,
            followUpDate:payload.followUpDate || null || undefined
        },
        include:{
            patient:true
        }
    })

    return result;

};

const patientPrescription=async(user:IAuthUser,options:IPagination)=>{
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options)
    const result=await prisma.prescription.findMany({
        where:{
            patient:{
                email:user?.email
            },
        },
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? 
        {[options.sortBy]:options.sortOrder}:{ createdAt:"desc"},
        include: {
            doctor:true,
            appointment:true,
            patient:true
        }
    });

    const total= await prisma.prescription.count({
        where:{
            patient:{
                email:user?.email
            }
        }
    })

    return {
        metaData:{
            page,
            limit,
            total
        },
        data:result
    };
}

export const PrescriptionService={
        insertIntoDB,
        patientPrescription
}