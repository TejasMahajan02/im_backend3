import { IsNotEmpty, IsString } from "class-validator";
import { EmailDto } from "src/common/dto/email.dto";

export class SignInUserDto extends EmailDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}