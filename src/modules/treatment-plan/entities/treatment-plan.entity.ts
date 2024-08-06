import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Case } from "../../case/entities/case.entity";
import { OrgDoctor } from "src/modules/doctor/entities/org-doctor.entity";
import { BaseEntity } from "src/common/entities/base.entity";

@Entity("treatment_plan")
export class TreatmentPlan extends BaseEntity {
    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    desc: string;

    @Column({ type: 'jsonb', nullable: false })
    images: object;

    @Column({ type: 'jsonb', nullable: false })
    videos: object;

    // Many treatment plans can have only one case
    @ManyToOne(() => Case, caseEntity => caseEntity.treatmentPlans)
    @JoinColumn({ name: "caseId" })
    case: Case;

    // Many orgDoctor/mentor can have many treatment plans
    @ManyToOne(() => OrgDoctor, orgDoctor => orgDoctor.treatmentPlans)
    @JoinColumn({ name: "orgDoctorId" })
    orgDoctor : OrgDoctor;
}
