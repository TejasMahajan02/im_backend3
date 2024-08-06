import { Module } from '@nestjs/common';
import { CaseController } from './case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './entities/case.entity';
import { CaseSupport } from './entities/case-support.entity';
import { CaseType } from './entities/case-type.entity';
import { CaseService } from './case.service';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      Case,
      CaseSupport,
      CaseType
    ]),
    UserModule,
    DoctorModule
  ],
  controllers: [CaseController],
  providers: [CaseService],
  exports : [CaseService]
})
export class CaseModule {}
