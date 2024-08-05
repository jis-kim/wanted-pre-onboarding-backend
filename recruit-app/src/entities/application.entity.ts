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

// 확장성을 위해 enum 으로 상태를 정의하되 varchar 타입으로 값 저장
export enum ApplicationStatus {
  SUBMITTED = 'submitted', // 제출
  ACCEPTED = 'accepted', // 합격
  REJECTED = 'rejected', // 불합격
}

@Entity()
@Unique(['userId', 'jobId'])
export class Application {
  // 지원서 아이디
  @PrimaryColumn({ type: 'varchar', length: 21 })
  applicationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 지원자 아이디
  @Column({ type: 'varchar', length: 21 })
  userId: string;

  // 채용공고 아이디
  @Column({ type: 'varchar', length: 21 })
  jobId: string;

  // 지원서 제목
  @Column({ type: 'varchar', length: 255 })
  title: string;

  // 지원서 내용
  @Column('text')
  content: string;

  @Column({ type: 'varchar', length: 20, default: ApplicationStatus.SUBMITTED })
  status: ApplicationStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
