import { Module } from '@nestjs/common';
import { TreatmentPlanController } from './treatment-plan.controller';
import { TreatmentPlanService } from './treatment-plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TreatmentPlan]),
    UserModule,
    DoctorModule
  ],
  controllers: [TreatmentPlanController],
  providers: [TreatmentPlanService]
})
export class TreatmentPlanModule { }
