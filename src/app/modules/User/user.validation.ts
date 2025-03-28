import { Gender } from "@prisma/client";
import { z } from "zod";

const createAdmin=z.object({
    password:z.string({required_error:"Password is requried"}),
    admin:z.object({
        name:z.string({required_error:"Name is required!"}),
        email:z.string({required_error:"Email is requird!"}),
        contactNumber:z.string({required_error:"Contact number is required!"})
    })
})
const createDoctor=z.object({
    password:z.string({required_error:"Password is requried"}),
    doctor:z.object({
        name:z.string({required_error:"Name is required!"}),
        email:z.string({required_error:"Email is requird!"}),
        contactNumber:z.string({required_error:"Contact number is required!"}),
        address:z.string({required_error:"Address are required"}),
        registrationNumber:z.string({required_error:"registration number are required"}),
        experience:z.number().optional(),
        gender:z.enum([Gender.MALE,Gender.FEMALE]),
        appointmentFee:z.number({required_error:"Appointment fee is required"}),
        qualification:z.string({required_error:"Qualificaton is required"}),
        currentWorkingPlace:z.string({required_error:"Current Woriking field required"}),
        designaton:z.string({required_error:"Designation is required"})

    })
})
const createPatient=z.object({
    password:z.string({required_error:"Password is requried"}),
    patient:z.object({
        name:z.string({required_error:"Name is required!"}),
        email:z.string({required_error:"Email is requird!"}),
        contactNumber:z.string({required_error:"Contact number is required!"}),
        address:z.string({required_error:"Address are required"}),
    })
})


export const UserValidation={
    createAdmin,
    createDoctor,
    createPatient
}