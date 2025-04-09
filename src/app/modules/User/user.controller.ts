import { Request, Response } from "express"
import { UserService } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import pick from "../../../shared/pick";
import { userFiltarableFields, userPaginationFields } from "./user.constant";


const createAdmin= async(req:Request,res:Response)=>{
  try {
    const result= await UserService.createAdmin(req);
    res.status(status.OK).json({
        success:true,
        message:"Admin created successfully",
        data:result
    });
    
  } catch (error) {
    res.status(500).json({
        success:false,
        message:(error as any)?.name || "Internal server error",
        error
    })
    
  }
};

const createDoctor= catchAsync(async(req:Request,res:Response)=>{
  const result= await UserService.createDoctor(req);

  sendResponse(res,{
    success:true,
    statusCode:status.OK,
    message:"Doctor create successfully",
    data:result
  })


});

const createPatient=catchAsync(async(req:Request,res:Response)=>{
  const result= await UserService.createPatient(req);

  sendResponse(res,{
    statusCode:status.OK,
    success:true,
    message:"Patient create successfully",
    data:result
  })

});

const getAllDB=catchAsync(async(req:Request,res:Response)=>{
  const filter=pick(req.query,userFiltarableFields)
  const options= pick(req.query,userPaginationFields)
  const result= await UserService.getAllDB(filter,options);

  sendResponse(res,{
    statusCode:status.OK,
    success:true,
    message:"All users successfully fetch",
    data:result
  })

});

const updateStatus= catchAsync(async(req:Request,res:Response)=>{
  const {id}=req.params;
  const result= await UserService.updateStatus(id,req.body);
  sendResponse(res,{
    statusCode:status.OK,
    success:true,
    message:"Status updated successfully",
    data:result
  })
});

const getMyProfile= catchAsync(async(req:Request,res:Response)=>{
  const user=req.user;
  const result= await UserService.getMyProfile(user);

  sendResponse(res,{
    statusCode:status.OK,
    success:true,
    message:"My profile fetch successfully",
    data:result
  })

})


export const UserController={
    createAdmin,
    createDoctor,
    createPatient,
    getAllDB,
    updateStatus,
    getMyProfile
}

