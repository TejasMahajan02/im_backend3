import { OrgDoctor } from "src/modules/doctor/entities/org-doctor.entity";
import { Case } from "../../case/entities/case.entity";
import { IsNotEmpty } from "class-validator";

export class CreateTreatmentPlanDto {
    @IsNotEmpty()
    title: string;
    desc: string;
    images: object;
    videos: object;
    case: Case;
    orgDoctor : OrgDoctor;
}