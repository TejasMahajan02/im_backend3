import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

// This will be used with any table
export abstract class BaseInviteEntity extends BaseEntity {
    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isInvited: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    invitedAt: Date;

    @Column({ default: false })
    isAccepted: boolean;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    AcceptedAt: Date;
}