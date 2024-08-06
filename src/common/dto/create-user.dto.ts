import { EmailDto } from "src/common/dto/email.dto";
import { Otp } from "src/common/modules/otp/entities/otp.entity";
import { DoctorInfo } from "src/modules/doctor/entities/doctor-info.entity";
import { Organization } from "src/modules/org/entities/org.entity";

export class CreateUserDto extends EmailDto {
    password: string;
    role: string;
    createdBy: string;
    otp?: Otp;
    doctorInfo?: DoctorInfo;
    organization?: Organization;
}