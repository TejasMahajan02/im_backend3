import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/org.entity';
import { OrgInviteDto } from './dto/org-invite.dto';
import { UserService } from '../user/user.service';
import { UserMessages } from 'src/common/constants/messages';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { Role } from 'src/common/enum/role.enum';
import { CreateUserDto } from 'src/common/dto/create-user.dto';

@Injectable()
export class OrgService {
    constructor(
        @InjectRepository(Organization)
        private orgRepository: Repository<Organization>,

        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    async findOneByRegNo(regNo: number): Promise<Organization | null> {
        return await this.orgRepository.findOneBy({ regNo, isDeleted: false });
    }

    async createAndSaveOrg(orgInviteDto: OrgInviteDto, createdBy: string) {
        const createUserDto = new CreateUserDto();
        createUserDto.email = orgInviteDto.email;
        createUserDto.role = Role.Organization;
        createUserDto.createdBy = createdBy;

        const userCreated = await this.authService.signUp(createUserDto);
        if (!userCreated) {
            throw new InternalServerErrorException(UserMessages.unexpectedError);
        }

        const org = new Organization();
        org.name = orgInviteDto.orgName;
        org.phone = orgInviteDto.phone;
        org.address1 = orgInviteDto.streetAddress;
        org.city = orgInviteDto.city;
        org.state = orgInviteDto.state;
        org.country = orgInviteDto.countryCode;
        org.regNo = orgInviteDto.regNo;
        org.createdBy = createdBy; // Admin uuid
        org.user = userCreated; // Org user reference

        return await this.orgRepository.save(org);
    }


    async findOrgByRegNo(regNo: number) : Promise<Organization | null> {
        return await this.orgRepository.findOne({
            where: { regNo, isDeleted: false },
        })
    }
}
