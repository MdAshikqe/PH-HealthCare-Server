import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SpecialteRoutes } from "../modules/Specialties/specialtie.route";
import { DoctorRoute } from "../modules/Doctor/doctor.routes";
import { PatientRouter } from "../modules/Patient/patient.routes";
import { SchedulesRouter } from "../modules/Schedule/schedule.route";

const router= express.Router();

const moduleRoutes=[
    {
        path:"/user",
        route:userRoutes
    },
    {
        path:"/admin",
        route:AdminRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
    {
        path:"/specialties",
        route:SpecialteRoutes
    },
    {
        path:"/doctor",
        route:DoctorRoute
    },
    {
        path:"/patient",
        route:PatientRouter
    },
    {
        path:"/schedule",
        route:SchedulesRouter
    }

    
];
moduleRoutes.forEach(route=>router.use(route.path, route.route));

export default router;
