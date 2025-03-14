type IOptions={
    page?:number,
    limit?:number,
    sortBy?:string,
    sortOrder?:string
}

type IOptionsResult={
    page:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder:string
}

const calculatePagination= (options:IOptions):IOptionsResult=>{
    const page:number=Number(options.page)||1;
    const limit:number= Number(options.limit)||10;
    const skip:number=(Number(page)-1) *limit;

    const sortOrder:string= options.sortOrder || "desc";
    const sortBy:string=options.sortBy || "createdAt";

    return{
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export const PaginationHelpers={
    calculatePagination
}