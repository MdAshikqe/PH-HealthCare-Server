import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
import path from "path"

dotenv.config({path:path.join(process.cwd(),'.env')})

export default{
    env:process.env.NODE_ENV,
    port:process.env.PORT,
    jwt:{
       access_token_secret:process.env.ACCESS_TOKEN_SECRET,
      access_token_expires_in:process.env.ACCESS_TOKEN_EXPIRES_IN,
      refresh_token_secret:process.env.REFRESH_TOKEN_SECRET,
      refresh_token_expires_in:process.env.REFRESH_TOKEN_EXPIRES_IN,
      reset_pass_token_secret:process.env.RESET_PASS_TOKEN_SECRET as Secret,
      reset_pass_token_expires_in:process.env.RESET_PASS_TOKEN_EXPIRES_IN as string
    },
      reset_pass_link:process.env.RESET_PASS_LINK,
      emailSender:{
        email:process.env.EMAIL,
        app_pass:process.env.APP_PASS
      }
    
}