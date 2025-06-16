import { PaymentStatus, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common"
import prisma from "../../../shared/prisma";



const fetchDashboardMetaData = async (user: IAuthUser) => {
    let metaData;
    switch (user?.role) {
        case UserRole.SUPER_ADMIN:
            metaData = getSuperAdminMetaData();
            break;
        case UserRole.ADMIN:
            metaData=getAdminMetaData();
            break;
        case UserRole.DOCTOR:
            metaData=getDoctorMetaData(user);
            break;
        case UserRole.PATIENT:
            metaData=getPatientMetaData(user);
            break;

        default:
           throw new Error("Invalid user role")
    }
    return metaData;
}

const getSuperAdminMetaData = async () => {
    const appointmentCount=await prisma.appointment.count();
    const patientCount=await prisma.patient.count();
    const doctorCount=await prisma.doctor.count();
    const paymentCount= await prisma.payment.count();
    const revenue= await prisma.payment.aggregate({
        _sum:{amount:true},
        where:{status:PaymentStatus.PAID}
    });

    const totalRevenue= revenue._sum.amount;

    const barCharData= await getBarChartData();
    const pieChartData=await getPieChartData();

    return {appointmentCount,patientCount,doctorCount,paymentCount,totalRevenue,barCharData,pieChartData}


}
const getAdminMetaData = async () => {
    const appointmentCount=await prisma.appointment.count();
    const patientCount=await prisma.patient.count();
    const doctorCount=await prisma.doctor.count();
    const paymentCount=await prisma.payment.count();
    const revenue=await prisma.payment.aggregate({
        _sum:{amount:true},
        where:{status:PaymentStatus.PAID}
    });
    const totalRevenue=revenue._sum.amount

    const barCharData= await getBarChartData();
    const pieChartData=await getPieChartData();

    return {appointmentCount,patientCount,doctorCount,paymentCount,totalRevenue,barCharData,pieChartData}

}
const getDoctorMetaData = async (user:IAuthUser) => {
    const doctorData= await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    });
    
    const appointmentCount= await prisma.appointment.count({
        where:{
            id:doctorData.id
        }
    })
    const patientCount=await prisma.appointment.groupBy({
        by:["patientId"],
        _count:{id:true}
    });
    const reviewCount= await prisma.review.count({
        where:{
            doctorId:doctorData.id
        }
    })
    const revenue= await prisma.payment.aggregate({
        _sum:{amount:true},
        where:{
            appointment:{
                doctorId:doctorData.id
            },
            status:PaymentStatus.PAID
        }
    })
    const totalRevenue=revenue._sum.amount;

    const appointmentStatusDistributtion= await prisma.appointment.groupBy({
        by:["status"],
        _count:{id:true},
        where:{
            doctorId:doctorData.id
        }
        
    })
    const formattedAppointmentStatusDistribution= appointmentStatusDistributtion.map(({status,_count})=>({
        status,
        count:Number(_count.id)
    }))


    return {appointmentCount,patientCount:patientCount.length,reviewCount,totalRevenue,formattedAppointmentStatusDistribution}

}
const getPatientMetaData = async (user:IAuthUser) => {
    const patientData= await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
    
    const appointmentCount= await prisma.appointment.count({
        where:{id:patientData.id}
    });

    const prescriptionCount= await prisma.prescription.count({
        where:{
            patientId:patientData.id
        }
    });

    const reviewCount= await prisma.review.count({
        where:{
            patientId:patientData.id
        }
    })

    const appointmentStatusDistributtion= await prisma.appointment.groupBy({
        by:["status"],
        _count:{id:true},
        where:{
            patientId:patientData.id
        }
    })

    const formattedAppointmentStatusDistribution=appointmentStatusDistributtion.map(({status,_count})=>({
        status,
        count:Number(_count.id)
    }))
    return {appointmentCount,prescriptionCount,reviewCount,formattedAppointmentStatusDistribution}
}

const getBarChartData=async()=>{
    const appointmentCountByMonths= await prisma.$queryRaw`
    SELECT DATE_TRUNC('month',"createAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC
    `

    return appointmentCountByMonths;
}

const getPieChartData=async()=>{
       const appointmentStatusDistributtion= await prisma.appointment.groupBy({
        by:["status"],
        _count:{id:true}
        
    })
    const formattedAppointmentStatusDistribution= appointmentStatusDistributtion.map(({status,_count})=>({
        status,
        count:Number(_count.id)
    }))

    return formattedAppointmentStatusDistribution;
}

export const MetaServices={
    fetchDashboardMetaData
}