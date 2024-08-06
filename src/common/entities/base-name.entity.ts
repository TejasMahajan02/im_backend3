import { BaseEntity } from 'src/common/entities/base.entity';
import { Column } from 'typeorm';

export abstract class BaseName extends BaseEntity {
    @Column({ nullable: false })
    name: string;
}
