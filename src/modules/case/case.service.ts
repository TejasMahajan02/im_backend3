import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseSupport } from './entities/case-support.entity';
import { CaseType } from './entities/case-type.entity';
import { Case } from './entities/case.entity';
import { NameDto } from '../../common/dto/name.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CaseMessages } from 'src/common/constants/messages';
import { UserService } from '../user/user.service';
import { DoctorService } from '../doctor/doctor.service';
import { OrgDoctor } from '../doctor/entities/org-doctor.entity';
import { Organization } from '../org/entities/org.entity';

@Injectable()
export class CaseService {
    constructor(
        @InjectRepository(Case)
        private caseRepository: Repository<Case>,

        @InjectRepository(CaseSupport)
        private caseSupportRepository: Repository<CaseSupport>,

        @InjectRepository(CaseType)
        private caseTypeRepository: Repository<CaseType>,

        private readonly userService: UserService,
        private readonly doctorService: DoctorService,

    ) { }


    // Used for select dropdown
    async addCaseSupport(nameDto: NameDto): Promise<object> {
        try {
            return await this.caseSupportRepository.save(nameDto);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getAllCaseSupports(): Promise<object> {
        return await this.caseSupportRepository.find({});
    }

    async addCaseType(nameDto: NameDto): Promise<object> {
        try {
            return await this.caseTypeRepository.save(nameDto);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getAllCaseTypes(): Promise<object> {
        return await this.caseTypeRepository.find({});
    }

    async create(createCaseDto: CreateCaseDto) {
        return this.caseRepository.create(createCaseDto);
    }

    async createCase(createCaseDto: CreateCaseDto): Promise<object> {
        // Get the mentor UUIDs
        const mentorIds = createCaseDto.mentors.map(mentor => mentor.uuid);

        // // Extract the unique identifier(s) for checking
        // const { title, patientDetails } = createCaseDto;

        // // Check if a case with the same title and organization already exists
        // const existingCase = await this.caseRepository.findOne({
        //     where: {
        //         title,
        //         patientDetails
        //     }
        // });

        // if (existingCase) {
        //     // Handle the case already existing
        //     throw new ConflictException('Case with the same details already exists.');
        // }

        // Validate mentors
        const mentors = [];
        for (const mentorId of mentorIds) {
            const orgDoctorEntity = await this.doctorService.findOrgDoctorById(mentorId);
            if (!orgDoctorEntity) {
                throw new NotFoundException(`Mentor with ID ${mentorId} not found`);
            }
            mentors.push(orgDoctorEntity);
        }

        createCaseDto.organization = mentors[0].organization;
        createCaseDto.orgDoctor = mentors[0];

        createCaseDto.mentors = mentors;

        return await this.caseRepository.save(createCaseDto);
    }

    async getAllCase(): Promise<object> {
        return await this.caseRepository.find({});
    }

    async getAllCaseByOrgDoctor(orgDoctor: OrgDoctor): Promise<object> {
        return await this.caseRepository.find({ where: { orgDoctor }, relations: ['case'] });
    }

    async getCase(id: string): Promise<object> {
        try {
            return await this.caseRepository.findBy({ uuid: id });
        } catch (error) {
            throw new NotFoundException(CaseMessages.notFound);
        }
    }

    async updateCase(id: string, updateCaseDto: UpdateCaseDto): Promise<object> {
        return await this.caseRepository.update({ uuid: id }, updateCaseDto);
    }

    async deleteCase(id: string): Promise<object> {
        return await this.caseRepository.update({ uuid: id }, { isDeleted: true });
    }

    async listCasesByOrgDoctor(orgDoctor: OrgDoctor) {
        // Fetch cases related to doctorInfo
        return await this.caseRepository.find({ where: { orgDoctor } })
    }

    async listCasesByOrg(organization: Organization) {
        // Fetch cases related to doctorInfo
        return await this.caseRepository.find({ where: { organization } })
    }


    async getCasesByUserUuid(userUuid: string): Promise<Case[]> {
        return await this.caseRepository.createQueryBuilder('case')
            .innerJoin('case.orgDoctor', 'orgDoctor')
            .innerJoin('orgDoctor.doctorInfo', 'doctorInfo')
            .innerJoin('doctorInfo.user', 'user')
            .where('user.uuid = :uuid', { uuid: userUuid })
            .getMany();
    }

    async fetchAllCasesByOrg(uuid: string) {
        const organization = await this.userService.findOrgByUserId(uuid);

        if (!organization) {
            throw new NotFoundException(`Organization with ID ${uuid} not found`);
        }

        return this.caseRepository.find({
            where: { organization: { uuid: organization.uuid } },
          });
    }
}
