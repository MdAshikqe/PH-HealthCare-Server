import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";


const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
}

const insertIntoDB= async(payload:any)=>{
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

                const result = await prisma.schedule.create({
                    data: scheduleData as any // Remove 'as any' after adding all required fields
                });
                schedules.push(result)
                
                startDate.setMinutes(startDate.getMinutes() + interverlTime);
            }
            
           currentDate.setDate(currentDate.getDate() + 1);
                  
    };

    return schedules;

}

export const ScheduleServices={
    insertIntoDB,
}