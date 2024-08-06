import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { PhoneDto } from './phone.dto';
import { Type } from 'class-transformer';

export class BaseInviteDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto;

  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;
}
