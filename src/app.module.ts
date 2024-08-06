import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from './config/jwt.config';
import { typeOrmConfig } from './config/typeorm.config';
import { EmailModule } from './common/modules/email/email.module';
import { AdminModule } from './modules/admin/admin.module';
import { OtpModule } from './common/modules/otp/otp.module';
import { AuthModule } from './common/modules/auth/auth.module';
import { OrgModule } from './modules/org/org.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { CaseModule } from './modules/case/case.module';
import { TreatmentPlanModule } from './modules/treatment-plan/treatment-plan.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    JwtModule.register(jwtConfig),
    UserModule,
    EmailModule,
    OtpModule,
    AuthModule,
    AdminModule,
    OrgModule,
    DoctorModule,
    CaseModule,
    TreatmentPlanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
