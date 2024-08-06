import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgDoctor } from './entities/org-doctor.entity';
import { Specialization } from './entities/specialization.entity';
import { NameDto } from 'src/common/dto/name.dto';
import { DoctorInviteDto } from './dto/doctor-invite.dto';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { Organization } from '../org/entities/org.entity';
import { AuthService } from 'src/common/modules/auth/auth.service';
import { Role } from 'src/common/enum/role.enum';
import { UserMessages } from 'src/common/constants/messages';
import { DoctorInfo } from './entities/doctor-info.entity';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(OrgDoctor)
        private orgDoctorRepository: Repository<OrgDoctor>,

        @InjectRepository(DoctorInfo)
        private doctorInfoRepository: Repository<DoctorInfo>,

        @InjectRepository(Specialization)
        private specializationRepository: Repository<Specialization>,

        private readonly authService: AuthService
    ) { }

    async addSpecialization(nameDto: NameDto): Promise<object> {
        try {
            return await this.specializationRepository.save(nameDto);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getAllSpecializations(): Promise<object> {
        return await this.specializationRepository.find({});
    }

    async getAllMentors(): Promise<OrgDoctor[] | null> {
        return await this.orgDoctorRepository.find({});
    }

    async createAndSaveDoctor(doctorInviteDto: DoctorInviteDto, createdBy: string) {
        const createUserDto = new CreateUserDto();
        createUserDto.email = doctorInviteDto.email;
        createUserDto.role = Role.Doctor;
        createUserDto.createdBy = createdBy;

        const userCreated = await this.authService.signUp(createUserDto);
        if (!userCreated) {
            throw new InternalServerErrorException(UserMessages.unexpectedError);
        }

        const doctorInfo = new DoctorInfo();
        doctorInfo.name = doctorInviteDto.doctorName;
        doctorInfo.phone = doctorInviteDto.phone;
        doctorInfo.address1 = doctorInviteDto.streetAddress;
        doctorInfo.city = doctorInviteDto.city;
        doctorInfo.state = doctorInviteDto.state;
        doctorInfo.country = doctorInviteDto.countryCode;
        doctorInfo.regNo = doctorInviteDto.regNo;
        doctorInfo.createdBy = createdBy; // Organization uuid
        doctorInfo.user = userCreated; // Doctor info user reference

        return await this.doctorInfoRepository.save(doctorInfo);
    }

    // Save orgDoctor
    async saveOrgDoctor(orgDoctor: OrgDoctor) {
        return await this.orgDoctorRepository.save(orgDoctor);
    }

    // For validation
    async findOrgAndDoctor(organization: Organization, doctorInfo: DoctorInfo): Promise<OrgDoctor | undefined> {
        return this.orgDoctorRepository.findOne({
            where: {
                organization: organization,
                doctorInfo: doctorInfo,
            },
            relations: ['organization', 'doctorInfo'],
        });
    }

    async findDoctorsByOrgUuid(orgUuid: string) {
        return this.orgDoctorRepository.createQueryBuilder('orgDoctor')
            .innerJoin('orgDoctor.organization', 'organization')
            .innerJoin('orgDoctor.doctorInfo', 'doctorInfo')
            .innerJoin('doctorInfo.user', 'user')
            .select([
                'doctorInfo.name AS doctorName',
                'user.email AS doctorEmail',
            ])
            .where('user.createdBy = :orgUuid', { orgUuid })
            .getRawMany();
    }


    // List all mentors from an organization
    async findMentorsByOrgUuid(orgUuid: string) {
        return this.orgDoctorRepository.createQueryBuilder('orgDoctor')
            .innerJoin('orgDoctor.organization', 'organization')
            .innerJoin('orgDoctor.doctorInfo', 'doctorInfo')
            .innerJoin('doctorInfo.user', 'user')
            .select([
                'doctorInfo.name AS doctorName',
                'orgDoctor.uuid AS orgDoctorId',
            ])
            .where('user.createdBy = :orgUuid', { orgUuid })
            .andWhere('orgDoctor.isMentor = true')
            .getRawMany();
    }

    // Find Doctor by doctor info id
    async findDoctorByInfoId(doctorInfo: DoctorInfo) {
        return await this.orgDoctorRepository.findOne({ where: { doctorInfo, isDeleted: false } })
    }

    // Find org doctor by org doctor id
    // I want to query org Doctor
    async findOrgDoctorById(uuid: string) {
        return await this.orgDoctorRepository.findOne({ where: { uuid, isDeleted: false }, relations : ['organization'] });
    }

    async listCasesByDoctorInfoId(doctorInfoId: string) {
        return this.orgDoctorRepository.createQueryBuilder('orgDoctor')
            .leftJoinAndSelect('orgDoctor.case', 'case')
            .where('orgDoctor.doctorInfoId = :doctorInfoId', { doctorInfoId })
            .select(['case.uuid', 'case.title', 'case.status']) // Select only required fields
            .getMany();
    }
    
}
