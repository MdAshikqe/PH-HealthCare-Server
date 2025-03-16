import  express, { Application, NextFunction, Request, Response }  from "express";
import cors from "cors";
import router from "./app/routes";
import status from "http-status";
import globalErrorHandaler from "./app/middlewares/globalErrorHandaler";
import notFound from "./app/middlewares/notFound";
const app:Application= express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

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