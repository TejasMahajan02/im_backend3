import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseInviteDto } from 'src/common/dto/base-invite.dto';

export class DoctorInviteDto extends BaseInviteDto {
  @IsNotEmpty()
  @IsString()
  doctorName: string;

  @IsNotEmpty()
  @IsBoolean()
  isMentor: boolean;

  // @IsNumber()
  regNo: number;
}
