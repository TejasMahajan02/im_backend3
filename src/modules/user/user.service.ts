import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // findUserById -- For delete operation
    async findUserById(uuid: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { uuid, isDeleted: false } });
    }

    // findUserById -- For delete operation
    async findUserByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email, isDeleted: false } });
    }

    // FindOtpByUserId
    async findOtpByUserId(uuid: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { uuid, isDeleted: false }, relations: ['otp'] });
    }

    // FindOtpByUserEmail
    async findOtpByUserEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email, isDeleted: false }, relations: ['otp'] });
    }

    // FindOrgByUserId
    async findOrgByUserId(uuid: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { uuid, isDeleted: false }, relations: ['organization'] });
    }

    // FindOrgByUserEmail
    async findOrgByUserEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email, isDeleted: false }, relations: ['organization'] });
    }

    // Look for doctor info record that stores org doctor
    async findDoctorByUserId(userId: string) {
        return this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.doctorInfo', 'doctorInfo')
            .leftJoinAndSelect('doctorInfo.orgDoctor', 'orgDoctor')
            .where('user.uuid = :userId', { userId })
            .getOne();
    }

    async listCasesByDoctorUserId(userId : string) {
        return this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.doctorInfo', 'doctorInfo')
            .leftJoinAndSelect('doctorInfo.orgDoctor', 'orgDoctor')
            .leftJoinAndSelect('orgDoctor.case', 'orgDoctorCases')
            .where('user.uuid = :userId', { userId })
            .getMany();
    }

    async getUserAndDoctorInfo(userId: string) {
        return this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.doctorInfo', 'doctorInfo')
            .where('user.uuid = :userId', { userId })
            .select(['user.uuid', 'doctorInfo.id']) // Select only required fields
            .getOne();
    }

    // findDoctorByUserEmail
    async findDoctorByUserEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email, isDeleted: false }, relations: ['doctorInfo'] });
    }

    // List all org created by specific user/admin
    async findAllOrgs(createdBy: string): Promise<any[]> {
        return await this.usersRepository.createQueryBuilder('user')
            .leftJoin('user.organization', 'organization')
            .select([
                'user.uuid AS user_uuid',
                'organization.name AS organization_name',
                'organization.phone AS phone_number',
                'user.email AS email',
                'organization.address1 AS organization_address',
                'organization.isActive AS organization_status',
            ])
            .where('user.createdBy = :createdBy', { createdBy })
            .andWhere('user.role = :role', { role: Role.Organization })
            .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
            // .andWhere('organization.isAccepted = :isAccepted', { isAccepted: true })
            .getRawMany();
    }

    async save(createUserDto: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(createUserDto);
    }

    async adminDashboard(email: string, numberOfRecords: number = 5, sortOrder: number = -1) {
        const order = sortOrder === 1 ? "ASC" : "DESC";
        return await this.usersRepository.find({
            relations: {
                organization: true,
            },
            where: {
                role: Role.Organization,
                createdBy: email,
                isDeleted: false,
            },
            order: {
                createdAt: order,
            },
            take: numberOfRecords,
        });
    }


    async orgDashboard(email: string, numberOfRecords: number = 5, sortOrder: number = -1) {
        const order = sortOrder === 1 ? "ASC" : "DESC";
        return await this.usersRepository.find({
            relations: {
                doctorInfo: true,
            },
            where: {
                role: Role.Doctor,
                createdBy: email,
                isDeleted: false,
            },
            order: {
                createdAt: order,
            },
            take: numberOfRecords,
        });
    }

}
