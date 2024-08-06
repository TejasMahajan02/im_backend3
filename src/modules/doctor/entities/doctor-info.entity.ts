import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { OrgDoctor } from './org-doctor.entity';

@Entity("doctor_info")
export class DoctorInfo extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    specialization: string;

    @Column({ type: 'jsonb', nullable: false })
    phone: object;

    @Column({ nullable: false })
    address1: string;

    @Column({ nullable: true })
    address2: string;

    @Column({ nullable: true })
    address3: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    regNo: number;

    // One doctor info can only have one user/credentials
    @OneToOne(() => User, user => user.doctorInfo)
    @JoinColumn({name : 'userId'})
    user: User;

    // One org doctor can only have one doctor info
    @OneToMany(() => OrgDoctor, orgDoctor => orgDoctor.doctorInfo)
    orgDoctor: OrgDoctor[];
}
