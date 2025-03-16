import { Response } from "express";

const sendResponse= <T>(res:Response,jsonData:{
    statusCode:number,
    success:boolean,
    message:string,
    metaData?:{
        page:number,
        limit:number,
        total:number
    },
    data:T| null|undefined
})=>{
    res.status(jsonData.statusCode).json({
        success:jsonData.success,
        message:jsonData.message,
        metaData:jsonData.metaData ||null||undefined,
        data:jsonData.data ||null || undefined
    });


}

export default sendResponse;