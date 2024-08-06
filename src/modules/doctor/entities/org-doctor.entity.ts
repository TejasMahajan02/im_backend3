import { BaseInviteEntity } from 'src/common/entities/base-invite.entity';

import { Organization } from 'src/modules/org/entities/org.entity';
import { Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany, Unique, Column } from 'typeorm';
import { DoctorInfo } from './doctor-info.entity';
import { Case } from 'src/modules/case/entities/case.entity';
import { TreatmentPlan } from 'src/modules/treatment-plan/entities/treatment-plan.entity';

@Entity("org_doctor")
@Unique(['organization', 'doctorInfo'])
export class OrgDoctor extends BaseInviteEntity {
    // Why here because one doctor can be a mentor or doctor in another org
    @Column({ default: false })
    isMentor: boolean;

    // One org can have many doctors and one doctor can become part of multiple orgs
    @ManyToOne(() => Organization, organization => organization.orgDoctors)
    @JoinColumn({ name: 'orgId' })
    organization: Organization;

    @ManyToOne(() => DoctorInfo, doctorInfo => doctorInfo.orgDoctor)
    @JoinColumn({ name: 'doctorId' })
    doctorInfo: DoctorInfo;

    // One doctor can have many cases
    @OneToMany(() => Case, caseEntity =>  caseEntity.orgDoctor)
    case : Case[];

    // One doctor/mentor can have many treatment plans
    @OneToMany(() => TreatmentPlan, treatmentPlans => treatmentPlans.orgDoctor)
    treatmentPlans : TreatmentPlan[];
}
