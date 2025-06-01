import  express, { Application, NextFunction, Request, Response }  from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandaler from "./app/middlewares/globalErrorHandaler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser"
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron"

const app:Application= express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



cron.schedule('* * * * *', () => {
  AppointmentService.cancleUnpaidAppoinment();
});


app.get("/",(req:Request,res:Response)=>{
    res.send({
        message:"Ph healthcare server is running......"
    })

})

// app.use("/api/v1/user",userRoutes)
// app.use("/api/v1/admin",AdminRoutes)

app.use("/api/v1",router);

app.use(globalErrorHandaler);

app.use(notFound);

export default app;