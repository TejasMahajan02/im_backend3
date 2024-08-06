import { Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TreatmentPlanMessages } from 'src/common/constants/messages';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryFailedError } from 'typeorm';
import { CreateTreatmentPlanDto } from './dto/treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { TreatmentPlanService } from './treatment-plan.service';

@Controller('treatment-plan')
export class TreatmentPlanController {
    constructor(
        private readonly treatmentPlanService: TreatmentPlanService,
    ) { }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Doctor)
    async createTreatmentPlan(@Body() createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<object> {
        try {
            const treatmentPlanEntity = await this.treatmentPlanService.createTreatmentPlan(createTreatmentPlanDto);
            if (!treatmentPlanEntity) {
                throw new InternalServerErrorException();
            }

            return { message: TreatmentPlanMessages.created };
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new ConflictException(TreatmentPlanMessages.isExist);
            }
            throw error;
        }
    }

    // Treatment Plans
    @Get(':id')
    async getTreatmentPlan(@Param() id: string): Promise<object> {
        return await this.treatmentPlanService.getTreatmentPlan(id);
    }

    @Delete(':id')
    async deleteTreatmentPlan(@Param() id: string): Promise<object> {
        return await this.treatmentPlanService.deleteTreatmentPlan(id);
    }

    @Patch('id')
    async updateTreatmentPlan(@Param() id: string, @Body() updateTreatmentPlanDto: UpdateTreatmentPlanDto): Promise<object> {
        return await this.treatmentPlanService.updateTreatmentPlan(id, updateTreatmentPlanDto);
    }
}
