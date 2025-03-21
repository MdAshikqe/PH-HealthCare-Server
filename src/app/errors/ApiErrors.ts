class ApiError extends Error{
    statuscode:number;
    constructor(statusCode:number,message:string | undefined, stack:''){
        super(message)
        this.statuscode=statusCode

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export default ApiError;