import { Body, ConflictException, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthController } from 'src/common/modules/auth/auth.controller';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ExpressRequest } from 'src/common/decorators/express-request.decorator';
import { DoctorInviteDto } from '../doctor/dto/doctor-invite.dto';
import { DoctorService } from '../doctor/doctor.service';
import { DoctorMessages, OrgMessages, UserMessages } from 'src/common/constants/messages';
import { OrgDoctor } from '../doctor/entities/org-doctor.entity';
import { DoctorInfo } from '../doctor/entities/doctor-info.entity';
import { QueryFailedError } from 'typeorm';
import { OrgService } from './org.service';

@Controller('org')
export class OrgController extends AuthController {
    constructor(
        authService: AuthService,
        private readonly userService: UserService,
        private readonly doctorService: DoctorService,
        private readonly orgService: OrgService,

    ) {
        super(authService);
    }

    // Org Dashboard which will list all mentors and doctors
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Organization)
    async dashboard(@Req() req: ExpressRequest) {
        const userId = req.user.uuid;
        return await this.doctorService.findDoctorsByOrgUuid(userId);
        // return 'Org Dashboard';
    }

    // List of mentors
    @Get('mentors')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Organization)
    async getAllMentors(@Req() req: ExpressRequest) {
        const userId = req.user.uuid;
        return await this.doctorService.findMentorsByOrgUuid(userId);
    }

    @Post('invite')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Organization)
    async inviteDoctor(@Req() req: ExpressRequest, @Body() doctorInviteDto: DoctorInviteDto) {
        const userId = req.user.uuid;

        // Check if doctor user is already present
        const doctorInfoUser = await this.userService.findDoctorByUserEmail(doctorInviteDto.email);

        let doctorInfoEntity: DoctorInfo;

        if (!doctorInfoUser) {
            // Create new doctor entity
            doctorInfoEntity = await this.doctorService.createAndSaveDoctor(doctorInviteDto, userId);

            if (!doctorInfoEntity) {
                throw new InternalServerErrorException(UserMessages.unexpectedError);
            }
        } else {
            doctorInfoEntity = doctorInfoUser.doctorInfo;
        }

        // Retrieve the organization entity
        const orgEntity = await this.userService.findOrgByUserId(userId);

        if (!orgEntity) {
            throw new InternalServerErrorException(OrgMessages.notFound);
        }

        // Check if the doctor is already invited to this organization
        const existingOrgDoctor = await this.doctorService.findOrgAndDoctor(orgEntity.organization, doctorInfoEntity);
        if (existingOrgDoctor) {
            throw new ConflictException(DoctorMessages.inviteExist);
        }

        // Create new OrgDoctor entity
        const newOrgDoctor = new OrgDoctor();
        newOrgDoctor.isMentor = doctorInviteDto.isMentor;
        newOrgDoctor.createdBy = userId;
        newOrgDoctor.doctorInfo = doctorInfoEntity;
        newOrgDoctor.organization = orgEntity.organization;

        // Save the new OrgDoctor entity
        try {
            const orgDoctorEntity = await this.doctorService.saveOrgDoctor(newOrgDoctor);

            if (!orgDoctorEntity) throw new InternalServerErrorException(UserMessages.unexpectedError);

            return { message: DoctorMessages.inviteSuccess };
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
                throw new ConflictException(DoctorMessages.inviteExist);
            }
            throw error;
        }
    }

}
