import { AppointmentStatus, PaymentStatus, UserRole } from "@prisma/client"
import prisma from "../../../shared/prisma"
import { IAuthUser } from "../../interfaces/common"
import ApiError from "../../errors/ApiErrors"
import Httpstatus from "http-status"

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

    const result= await prisma.review.create({
        data:{
            patientId:appointmentData.patientId,
            doctorId:appointmentData.doctorId,
            appointmentId:appointmentData.id,
            rating:payload.rating,
            comment:payload.comment
        },
        include:{
            appointment:true,
            doctor:true,
            patient:true
        }
    })
    return result;
}

export const ReviewService={
    insertIntoDB,
}