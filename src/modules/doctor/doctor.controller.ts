import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthController } from 'src/common/modules/auth/auth.controller';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { DoctorService } from './doctor.service';
import { NameDto } from 'src/common/dto/name.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ExpressRequest } from 'src/common/decorators/express-request.decorator';
import { UserService } from '../user/user.service';

@Controller('doctor')
export class DoctorController extends AuthController {
    constructor(
        authService: AuthService,
        private readonly doctorService: DoctorService,
        private readonly userService: UserService,
    ) {
        super(authService);
    }

    // Used for select dropdown
    @Post('specialization')
    async addSpecialization(@Body() nameDto: NameDto): Promise<object> {
        return await this.doctorService.addSpecialization(nameDto);
    }

    @Get('specialization')
    async getAllSpecializations(): Promise<object> {
        return await this.doctorService.getAllSpecializations();
    }

}
