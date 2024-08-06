import { Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CaseService } from './case.service';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { NameDto } from '../../common/dto/name.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExpressRequest } from 'src/common/decorators/express-request.decorator';
import { UserService } from '../user/user.service';
import { DoctorService } from '../doctor/doctor.service';
import { QueryFailedError } from 'typeorm';
import { CaseMessages, TreatmentPlanMessages, UserMessages } from 'src/common/constants/messages';
import { UpdateTreatmentPlanDto } from '../treatment-plan/dto/update-treatment-plan.dto';
import { CreateTreatmentPlanDto } from '../treatment-plan/dto/treatment-plan.dto';

@Controller('case')
export class CaseController {
    constructor(
        private readonly caseService: CaseService,
        private readonly userService: UserService,
        private readonly doctorService: DoctorService,
    ) { }

    // Used for select dropdown
    @Post('case-support')
    async addCaseSupport(@Body() nameDto: NameDto): Promise<object> {
        return await this.caseService.addCaseSupport(nameDto);
    }

    @Get('case-support')
    async getAllCaseSupports(): Promise<object> {
        return await this.caseService.getAllCaseSupports();
    }

    // Used for select dropdown
    @Post('case-type')
    async addCaseType(@Body() nameDto: NameDto): Promise<object> {
        return await this.caseService.addCaseType(nameDto);
    }

    @Get('case-type')
    async getAllCaseTypes(): Promise<object> {
        return await this.caseService.getAllCaseTypes();
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Doctor)
    async createCase(
        @Req() req: ExpressRequest,
        @Body() createCaseDto: CreateCaseDto
    ): Promise<object> {
        const createdBy = req.user.uuid;
        createCaseDto.createdBy = createdBy;
        return await this.caseService.createCase(createCaseDto);
    }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Doctor, Role.Organization)
    async getAllCase(@Req() req: ExpressRequest): Promise<object> {
        const { uuid, role } = req.user;

        if (role === Role.Doctor) {

            // Search for doctors
            return this.userService.findDoctorByUserId(uuid);
        } else {
            // search for orgs
            return this.userService.findOrgByUserId(uuid);
        }

        
        if (role === Role.Doctor) {
            // list all cases of doctor
            const doctorUser = await this.userService.findDoctorByUserId(uuid);
            if (!doctorUser) {
                throw new NotFoundException();
            }

            const orgDoctor = doctorUser.doctorInfo.orgDoctor[0];
            return await this.caseService.listCasesByOrgDoctor(orgDoctor);

        } else {

            const org = await this.userService.findOrgByUserId(uuid);
            if (!org) {
                throw new NotFoundException();
            }

            return await this.caseService.listCasesByOrg(org.organization);
        }
    }

    // Cases
    @Get(':id')
    async getCase(@Param() id: string): Promise<object> {
        return await this.caseService.getCase(id);
    }

    @Delete(':id')
    async deleteCase(@Param() id: string): Promise<object> {
        return await this.caseService.deleteCase(id);
    }

    @Patch('id')
    async updateCase(@Param() id: string, @Body() updateCaseDto: UpdateCaseDto): Promise<object> {
        return await this.caseService.updateCase(id, updateCaseDto);
    }
}
