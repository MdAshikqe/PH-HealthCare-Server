import { Prisma } from "@prisma/client";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import prisma from "../../../shared/prisma"
import { IAuthUser } from "../../interfaces/common";
import { IPagination } from "../../interfaces/pagination";
import ApiError from "../../errors/ApiErrors";
import status from "http-status";
import { TMuslima } from "./doctorSchedule.interface";


const insertIntoDB= async(user:any,payload:{scheduleIds:string[]})=>{

    const doctorData= await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })

    const doctorScheduleData=payload.scheduleIds.map(scheduleId=>({
        doctorId:doctorData.id,
        scheduleId

    }))
    
    const result= await prisma.doctorSchedules.createMany({
        data:doctorScheduleData
    })

    return result;
};


const getMySchedule= async(filters:any,options:IPagination,user:IAuthUser)=>{
    const {limit,page,skip}=PaginationHelpers.calculatePagination(options);
    const {startDateTime,endDateTime,...filterData}=filters;

        const doctorData= await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })

    const andConditions=[];

    if(startDateTime & endDateTime){
        andConditions.push({
            AND:[
                {
                    schedule:{
                        startDate:{
                            gte:startDateTime
                        }
                    }
                },
                {
                    schedule:{
                        endDate:{
                            lte:endDateTime
                        }
                    }
                }
            ]
        })
    };

    if(Object.keys(filterData).length>0){

        if(typeof filterData.isBooked ==="string" && filterData.isBooked==="true"){
            filterData.isBooked=true
        }

        else if(typeof filterData.isBooked ==="string" && filterData.isBooked==="false"){
            filterData.isBooked=false
        }

        andConditions.push({
            AND:Object.keys(filterData).map(key=>({
                [key]:{
                    equals:(filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions:Prisma.DoctorSchedulesWhereInput=andConditions.length >0 ? {AND:andConditions}:{};



    const result= await prisma.doctorSchedules.findMany({
        where:{
            ...whereConditions,
            doctor:{
                email:doctorData.email
            }
        },
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]:options.sortOrder}:{},
        include:{
            doctor:{
                select:{
                    email:true,
                    name:true,
                }
            },
            schedule:{
                select:{
                    startDate:true,
                    endDate:true,

                }
            }
        }
    });

    const total= await prisma.doctorSchedules.count({
        where:{
            ...whereConditions,
            doctor:{
                email:doctorData.email
            }
        },
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

const deleteMyScheduleFromDB= async(user:IAuthUser,id:string)=>{
    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })

       const isBookedSchedule= await prisma.doctorSchedules.findUnique({
            where:{
                doctorId_scheduleId:{
                    doctorId:doctorData.id,
                    scheduleId:id
                },
                isBooked:true
            }
        })
        if(isBookedSchedule){
            throw new ApiError(status.BAD_REQUEST,"You can not delete the schedule because of the schedule is booked","")
        }

    const result=await prisma.doctorSchedules.delete({
        where:{
           doctorId_scheduleId:{
            doctorId:doctorData.id,
            scheduleId:id
           }
            
        }
    })
    return result
};

const getAllDoctorSchedule= async(filters:any,options:IPagination)=>{

    const {limit,page,skip}=PaginationHelpers.calculatePagination(options);
    const {searchTerm,...filterData}=filters;

    const andConditions=[];

    if(searchTerm){
        andConditions.push({
            doctor:{
                name:{
                    contains:searchTerm,
                    mode:'insensitive'
                }
            }
        })
    }

    if(Object.keys(filterData).length>0){
         if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        } else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }
        andConditions.push({
            AND:Object.keys(filterData).map(key=>({
                [key]:{
                    equals:(filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions:any=andConditions.length >0 ? {AND:andConditions}:{};

    const total=await prisma.doctorSchedules.count({
        where:whereConditions
    })
    const result= await prisma.doctorSchedules.findMany({
        where:whereConditions,
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{},
        include:{
            doctor:true,
            schedule:true
        }
    })

    return{
        metaData:{
            total,
            page,
            limit
        },
        data:result
    }

    
};

const getMuslima=()=>{
    console.log("muslim get retrive all")
}


 function muslim(personaly:TMuslima) {
        
    
}





export const DoctorScheduleServices={
    insertIntoDB,
    getMySchedule,
    deleteMyScheduleFromDB,
    getAllDoctorSchedule
}