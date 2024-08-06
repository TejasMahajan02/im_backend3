import { IsNotEmpty, IsEmail, IsString } from "class-validator";

// Patient details object
export class PatientDetailsDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    dob: string;

    @IsString()
    gender: string
}
