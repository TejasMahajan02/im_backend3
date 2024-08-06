import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorInfo } from './entities/doctor-info.entity';
import { OrgDoctor } from './entities/org-doctor.entity';
import { AuthModule } from 'src/common/modules/auth/auth.module';
import { DoctorService } from './doctor.service';
import { Specialization } from './entities/specialization.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorInfo, OrgDoctor, Specialization]),
    AuthModule,
    UserModule
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports : [DoctorService],
})
export class DoctorModule {}
