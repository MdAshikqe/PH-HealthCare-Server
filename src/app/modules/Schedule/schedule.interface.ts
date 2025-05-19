export type ISchedule={
    startDate:string,
    endDate:string,
    startTime:string,
    endTime:string
}

export type IFilterRequest={
    startDateTime?:string |undefined,
    endDateTime?:string | undefined
}