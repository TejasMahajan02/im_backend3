import { Body, ConflictException, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { Role } from 'src/common/enum/role.enum';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthController } from 'src/common/modules/auth/auth.controller';
import { ExpressRequest } from 'src/common/decorators/express-request.decorator';
import { UserService } from '../user/user.service';
import { OrgInviteDto } from '../org/dto/org-invite.dto';
import { OrgService } from '../org/org.service';
import { OrgMessages, UserMessages } from 'src/common/constants/messages';

@Controller('admin')
export class AdminController extends AuthController {
    constructor(
        authService: AuthService,
        private readonly userService: UserService,
        private readonly orgService: OrgService,
    ) {
        super(authService);
    }

    @Post('register')
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles(Role.SuperAdmin)
    async create(@Body() createUserDto: CreateUserDto): Promise<object> {
        createUserDto.role = Role.SuperAdmin;

        const userCreated = await this.authService.signUp(createUserDto);

        if (!userCreated) {
            throw new InternalServerErrorException(UserMessages.unexpectedError);
        }

        return { message: UserMessages.ok }
    }

    // Admin Dashboard which shows all the invited orgs
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SuperAdmin)
    async dashboard(@Req() req: ExpressRequest) {
        const userId = req.user.uuid;

        const allOrganizations = await this.userService.findAllOrgs(userId);

        if (allOrganizations.length === 0) {
            return { message: OrgMessages.notFound }
        }

        return allOrganizations;
    }

    // Organization invite
    @Post('invite')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SuperAdmin)
    async inviteOrg(
        @Req() req: ExpressRequest,
        @Body() orgInviteDto: OrgInviteDto
    ) {

        const userId = req.user.uuid;

        // When inviting organizations we must validate email & registration number
        if (await this.userService.findOrgByUserEmail(orgInviteDto.email)) {
            throw new ConflictException(OrgMessages.userExist);
        }

        // Validating reg no
        if (await this.orgService.findOneByRegNo(orgInviteDto.regNo)) {
            throw new ConflictException(OrgMessages.regNoExist);
        }

        const orgEntity = await this.orgService.createAndSaveOrg(orgInviteDto, userId);
        if (!orgEntity) {
            throw new InternalServerErrorException(UserMessages.unexpectedError);
        }

        return { message: OrgMessages.success };
    }
}
