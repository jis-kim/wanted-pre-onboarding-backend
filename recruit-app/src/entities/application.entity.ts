import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

@Entity()
@Unique(['userId', 'jobId'])
export class Application {
  // 지원서 아이디
  @PrimaryColumn({ type: 'varchar', length: 24 })
  applicationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 지원자 아이디
  @Column({ type: 'varchar', length: 24 })
  userId: string;

  // 채용공고 아이디
  @Column({ type: 'varchar', length: 24 })
  jobId: string;

  // 지원서 제목
  @Column({ type: 'varchar', length: 255 })
  title: string;

  // 지원서 내용
  @Column('text')
  content: string;

  // 지원 상태 - submitted, accepted, rejected
  @Column({ type: 'smallint' }) // char?
  status: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
