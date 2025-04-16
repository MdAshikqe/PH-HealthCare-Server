import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { SpecialteRoutes } from "../modules/Specialties/specialtie.route";

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
    }

    
];
moduleRoutes.forEach(route=>router.use(route.path, route.route));

export default router;
