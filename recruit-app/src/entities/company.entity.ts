import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Job } from './job.entity';

// 회사 정보를 저장하는 엔티티
@Entity()
export class Company {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'varchar', length: 255 })
  region: string;

  @Column({ type: 'varchar', length: 255 })
  industry: string;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
