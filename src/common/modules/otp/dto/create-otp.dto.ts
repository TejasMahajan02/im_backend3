import { EmailDto } from "src/common/dto/email.dto";

export class CreateOtpDto extends EmailDto {
    role: string;
    otp: string;
    createdAt: string;
}