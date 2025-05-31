import axios from "axios"
import { response } from "express";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";
const initPayment=async(appointmentId:string)=>{

    const paymentData=await prisma.payment.findFirstOrThrow({
        where:{
            appointmentId
        },
        include:{
            appointment:{
                include:{
                    patient:true
                }
            }
        }
    })

    const initPaymentData={
        amount:paymentData.amount,
        transactionId:paymentData.transactionId,
        name:paymentData.appointment.patient.name,
        email:paymentData.appointment.patient.email,
        address:paymentData.appointment.patient.address,
        phoneNumber:paymentData.appointment.patient.contactNumber
    }

    const result=await SSLService.initPayment(initPaymentData)
    return {
        PaymentUrl: result.GatewayPageURL
    }

}

const validatedPayment=async(payload:any)=>{
    //-----for production ------


    // if(!payload || !payload.status || !(payload.status ==="VALID")){
    //     return {
    //         message:"Invalid Payment!"
    //     }
    // }
    // const response= await SSLService.validatePayment(payload)

    // if(response?.status !== 'VALID'){
    //     return {
    //         message:"Payment Failed!"
    //     }
    // }


    //production please comment response---------***********
    const response=payload

    await prisma.$transaction(async(tx)=>{
       const updataPaymentData= await prisma.payment.update({
            where:{
                transactionId:response.tran_id
            },
            data:{
                status:PaymentStatus.PAID,
                paymentGatewayData:response
            }
        })

        await prisma.appointment.update({
            where:{
                id:updataPaymentData.appointmentId
            },
            data:{
                paymentStatus:PaymentStatus.PAID
            }
        })
    })

    return {
        message:"Payment successfully"
    }
}

export const PaymentService={
    initPayment,
    validatedPayment
}