import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorService } from '../doctor/doctor.service';
import { UserService } from '../user/user.service';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { CaseMessages } from 'src/common/constants/messages';
import { OrgDoctor } from '../doctor/entities/org-doctor.entity';
import { CreateTreatmentPlanDto } from './dto/treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';

@Injectable()
export class TreatmentPlanService {
    constructor(
        @InjectRepository(TreatmentPlan)
        private treatmentPlanRepository: Repository<TreatmentPlan>,

        private readonly doctorService : DoctorService,
        private readonly userService : UserService
    ) { }


    async getAllTreatmentPlans(): Promise<object> {
        return await this.treatmentPlanRepository.find({});
    }

    async getAllTreatmentPlansByOrgDoctor(orgDoctor: OrgDoctor): Promise<object> {
        return await this.treatmentPlanRepository.find({ where: { orgDoctor }, relations: ['TreatmentPlan'] });
    }

    async createTreatmentPlan(createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<object> {
        return createTreatmentPlanDto;
        
    }

    async getTreatmentPlan(id: string): Promise<object> {
        try {
            return await this.treatmentPlanRepository.findBy({ uuid: id });
        } catch (error) {
            throw new NotFoundException(CaseMessages.notFound);
        }
    }

    async updateTreatmentPlan(id: string, updateTreatmentPlanDto: UpdateTreatmentPlanDto): Promise<object> {
        return await this.treatmentPlanRepository.update({ uuid: id }, updateTreatmentPlanDto);
    }

    async deleteTreatmentPlan(id: string): Promise<object> {
        return await this.treatmentPlanRepository.update({ uuid: id }, { isDeleted: true });
    }

    
}
