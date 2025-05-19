import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Schedule } from "@prisma/client";
import { ISchedule } from "./schedule.interface";
import { PaginationHelpers } from "../../../helpars/paginationHelpars";
import { scheduler } from "timers/promises";


const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
}

const insertIntoDB= async(payload:ISchedule):Promise<Schedule[]>=>{
    const {startDate,endDate,startTime,endTime}=payload;
 

    const currentDate=new Date(startDate) //startDate
    const lastDate=new Date(endDate) //endDate



    const interverlTime=30;
    const schedules=[];

    while(currentDate <= lastDate){
            const startDate=new Date(
                addMinutes(
                    addHours(
                    `${format(currentDate,'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
                )
            );

            const endDate=new Date(
                addMinutes(
                    addHours(
                    `${format(currentDate,'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
                )
            );

            while(startDate < endDate){
                // const scheduleData = {
                //     startDateTime: startDateTime.toISOString(),
                //     endDateTime: addMinutes(startDateTime, interverlTime).toISOString(),
                //     // Add other required fields for Schedule model here, e.g.:
                //     // userId: payload.userId,
                //     // doctorId: payload.doctorId,
                // };
                            const s = await convertDateTime(startDate);
            const e = await convertDateTime(addMinutes(startDate, interverlTime))

            const scheduleData = {
                startDate: s,
                endDate: e
            }

            const existingSchedule= await prisma.schedule.findFirst({
                where:{
                    startDate:scheduleData.startDate,
                    endDate:scheduleData.endDate
                }
            })

            if(!existingSchedule){
                     const result = await prisma.schedule.create({
                    data: scheduleData as any // Remove 'as any' after adding all required fields
                });
                schedules.push(result)
            }
                
                startDate.setMinutes(startDate.getMinutes() + interverlTime);
            }
            
           currentDate.setDate(currentDate.getDate() + 1);
                  
    };

    return schedules;

}

const getAllDB=async(filters:any,options:any,user:any)=>{
    const {page,limit,skip}=PaginationHelpers.calculatePagination(options);
    const {startDateTime,endDateTime,...filterData}=filters;
    
   
    const andConditions=[];

     if(startDateTime && endDateTime){
       andConditions.push({
         AND:[
            {
                startDate:{
                    gte:startDateTime
                }
            },
            {
                endDate:{
                    lte:endDateTime
                }
            }
        ]
       })
    }

    if(Object.keys(filterData).length>0){
        andConditions.push({
            AND:Object.keys(filterData).map(key=>({
                [key]:{
                    equals:(filterData as any)[key],
                }
            }))
        })
    }

    const whereCondition=andConditions.length>0 ? {AND:andConditions}:{};

    const doctorSchedules= await prisma.doctorSchedules.findMany({
        where:{
            doctor:{
                email:user?.email
            }
        }

    });
   

    const doctorSchedulesIds=doctorSchedules.map(schedule=>schedule.scheduleId)
     console.log(doctorSchedulesIds)



    const result= await prisma.schedule.findMany({
        where:{
            ...whereCondition,
            id:{
                notIn:doctorSchedulesIds
            }
        },
        skip,
        take:limit,
        orderBy:options.sortBy && options.sortOrder ? {
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:"desc"
        }
    })
    const total= await prisma.schedule.count({
        where:{
            ...whereCondition,
            id:{
                notIn:doctorSchedulesIds
            }
        }
    })
    return {
        metaData:{
            page,
            limit,
            total
        },
        data:result,

    }
}

export const ScheduleServices={
    insertIntoDB,
    getAllDB
}