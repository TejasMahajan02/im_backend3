import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
import { PatientDetailsDto } from "./patient-details.dto";
import { MentorDto } from "./mentor.dto";
import { Organization } from "src/modules/org/entities/org.entity";
import { OrgDoctor } from "src/modules/doctor/entities/org-doctor.entity";

export class CaseDto {
    @IsObject()
    @ValidateNested()
    @Type(() => PatientDetailsDto)
    patientDetails: PatientDetailsDto;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    support: string;

    desc: string;
    status: string;
    isFavorite: boolean;
    images: object;
    videos: object;

    @IsNotEmpty()
    treatmentPlan: string;

    @IsArray()
    // @ValidateNested({ each: false })
    @Type(() => MentorDto)
    @IsNotEmpty()
    mentors: MentorDto[];

    emergencyContactName: string;
    emergencyContactRelationship: string;
    allergies: string;
    currentMedications: string;
    previousDentalTreatments: string;
    generalHealthStatus: string;
    createdBy : string;

    organization : Organization;
    orgDoctor : OrgDoctor;
}