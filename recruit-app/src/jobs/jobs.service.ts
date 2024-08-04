import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { Job } from '../entities';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<string> {
    const jobId = nanoid();
    const result = await this.jobRepository.insert({
      jobId,
      ...createJobDto,
    });
    return jobId;
  }

  async find() {
    return 'This action returns all job';
  }

  findAll() {
    return `This action returns all job`;
  }

  findOne(jobId: string) {
    return this.jobRepository.findOneBy({ jobId });
  }

  async update(jobId: string, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(jobId);
    if (!job) {
      throw new NotFoundException('존재하지 않는 채용공고 입니다.');
    }
    const companyId = updateJobDto.companyId;
    if (job.companyId !== companyId) {
      throw new ForbiddenException('채용공고 수정 권한이 없습니다.');
    }
    updateJobDto.companyId = undefined;

    await this.jobRepository.update(jobId, updateJobDto);
    // 변경된 job 정보를 반환
    return { ...job, ...updateJobDto };
  }

  async remove(jobId: string) {
    const { affected } = await this.jobRepository.delete(jobId);
    if (affected === 0) {
      throw new NotFoundException('존재하지 않는 채용공고 입니다.');
    }
  }
}
