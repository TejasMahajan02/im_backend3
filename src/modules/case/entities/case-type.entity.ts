import { BaseName } from 'src/common/entities/base-name.entity';
import { Entity } from 'typeorm';

@Entity("case_type")
export class CaseType extends BaseName {}
