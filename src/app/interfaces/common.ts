import { UserRole } from "@prisma/client";

export type IAuthUser={
    email:string;
    role:UserRole;
} | null;

export type IFile= {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }