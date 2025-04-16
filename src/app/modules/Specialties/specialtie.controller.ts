import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialteService } from "./specialtie.service";


const insertInToDB=catchAsync(async(req,res)=>{
    const result=await SpecialteService.insertInToDB(req);

    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Successfully insert specialties data",
        data:result
    })
})

export const SpecialteController={
    insertInToDB
}