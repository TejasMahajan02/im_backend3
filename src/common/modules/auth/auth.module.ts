import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordService } from 'src/common/services/password.service';
import { JwtUtilService } from 'src/common/services/jwt.service';
import { UserModule } from '../../../modules/user/user.module';
import { EmailModule } from 'src/common/modules/email/email.module';
import { OtpModule } from 'src/common/modules/otp/otp.module';

@Module({
  imports : [
    UserModule,
    EmailModule,
    OtpModule
  ],
  providers: [AuthService, PasswordService, JwtUtilService],
  exports : [AuthService]
})
export class AuthModule {}
