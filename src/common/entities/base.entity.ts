import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// This will be used with any table
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  modifiedBy: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  modifiedAt: Date;
}
