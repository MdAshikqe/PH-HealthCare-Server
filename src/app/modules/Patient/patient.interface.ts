import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";
import { BlobOptions } from "buffer";
import { string } from "zod";

export type IPatientFilterRequest={
    searchTerm?:string |undefined;
    email?:string |undefined;
    contactNumber?:string |undefined;
};


type IPatientHealthData={
  birthDate: string;
  gender:Gender;
  bloodGroup: BloodGroup;
  hasAllergies?:boolean;
  hasDiabetes?:boolean;
  height:string
  weight: string
  smokingStatus?:boolean
  dietaryPreferences?:string
  pregnancyStatus?:boolean
  mentalHealthHistory?:string
  immunizationStatus?:string
  hasPastSurgeries?: boolean
  recentAnxiety?: boolean
  recentDepression?: boolean
  maritalStatus: MaritalStatus
}

type IMedicalReport={
  reportName:string;
  reportLink:string;
}


export type IPatientUpdateInfo={
  name:string;           
  contactNumber:string;
  address:string
  healthData:IPatientHealthData;
  medicalReport:IMedicalReport
}