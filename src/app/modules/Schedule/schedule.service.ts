import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";

const insertIntoDB= async(payload:any)=>{
    const {startDate,endDate,startTime,endTime}=payload;
 

    const currentDate=new Date(startDate) //startDate
    const lastDate=new Date(endDate) //endDate



    const interverlTime=30;

    while(currentDate <= lastDate){
            const startDateTime=new Date(
                addMinutes(
                    addHours(
                    `${format(currentDate,'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
                )
            );

            const endDateTime=new Date(
                addMinutes(
                    addHours(
                    `${format(currentDate,'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
                )
            );

            while(startDateTime < endDateTime){
                const scheduleData={
                    startDateTime:startDateTime,
                    endDateTime:addMinutes(startDateTime,interverlTime)
                }
                console.log(scheduleData)

                const result= await prisma
                
                startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
            }
            
           currentDate.setDate(currentDate.getDate() + 1);
                  
    }

}

export const ScheduleServices={
    insertIntoDB,
}