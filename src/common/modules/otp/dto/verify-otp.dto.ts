import { IsNotEmpty, IsNumber } from "class-validator";
import { EmailDto } from "src/common/dto/email.dto";

export class VerifyOtpDto extends EmailDto {
    @IsNotEmpty()
    @IsNumber()
    otp: number;
}
