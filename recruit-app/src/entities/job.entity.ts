import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Application } from './application.entity';

@Entity()
export class Job {
  @PrimaryColumn({ type: 'varchar', length: 24 })
  jobId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ type: 'varchar', length: 512 })
  skills: string;

  @Column('int')
  reward: number;

  @Column('text')
  description: string;

  // 채용마감일
  @Column('date')
  dueDate: Date;

  @Column({ type: 'varchar', length: 24 })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
