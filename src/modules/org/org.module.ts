import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/org.entity';
import { AuthModule } from 'src/common/modules/auth/auth.module';
import { UserModule } from '../user/user.module';
import { OrgService } from './org.service';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    AuthModule,
    UserModule,
    DoctorModule
  ],
  providers: [OrgService],
  controllers: [OrgController],
  exports : [OrgService]
})
export class OrgModule { }
