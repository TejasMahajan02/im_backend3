import { IsNotEmpty, IsNumber } from "class-validator";

// Patient details object
export class PhoneDto {
    @IsNotEmpty()
    @IsNumber()
    mo: number;
}
