import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { Company, Job } from '../entities';
import { CreateJobDto } from './dto/create-job.dto';
import { JobInfo, JobListDto } from './dto/job-list.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobDetailDto } from './dto/job-detail.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(company: Company, createJobDto: CreateJobDto): Promise<string> {
    const jobId = nanoid();
    await this.jobRepository.insert({
      jobId,
      companyId: company.companyId,
      ...createJobDto,
    });
    return jobId;
  }

  async findByKeyword(keyword: string) {
    const jobList = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.position LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('job.skills LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('job.country LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('job.region LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('company.companyName LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
    return jobList;
  }

  async findAll() {
    const jobList: Job[] = await this.jobRepository.find({
      select: {
        jobId: true,
        position: true,
        skills: true,
        country: true,
        region: true,
        dueDate: true,
        company: {
          companyId: true,
          companyName: true,
        },
      },
      relations: ['company'],
    });
    return jobList;
  }

  async findDetailedOne(jobId: string): Promise<JobDetailDto> {
    const detailedJob = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('company.jobs', 'anotherJobs')
      .select([
        'job',
        'company.companyId',
        'company.companyName',
        'anotherJobs.jobId',
        'anotherJobs.position',
      ])
      .where('job.jobId = :jobId', { jobId })
      .andWhere('anotherJobs.jobId != :jobId', { jobId })
      .getOne();

    if (!detailedJob) {
      throw new NotFoundException('존재하지 않는 채용공고 입니다.');
    }

    return detailedJob;
  }

  async update(jobId: string, company: Company, updateJobDto: UpdateJobDto) {
    const job = await this.findOndById(jobId);
    const companyId = company.companyId;
    if (job.companyId !== companyId) {
      throw new ForbiddenException('채용공고 수정 권한이 없습니다.');
    }

    await this.jobRepository.update(jobId, updateJobDto);
    // 변경된 job 정보를 반환
    return { ...job, ...updateJobDto };
  }

  async remove(jobId: string, company: Company) {
    const job = await this.findOndById(jobId);
    if (job.companyId !== company.companyId) {
      throw new ForbiddenException('채용공고 삭제 권한이 없습니다.');
    }
    await this.jobRepository.delete(jobId);
  }

  async findOndById(jobId: string): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ jobId });
    if (!job) {
      throw new NotFoundException('존재하지 않는 채용공고 입니다.');
    }
    return job;
  }

  formatJobList(jobList: Job[]): JobListDto {
    return {
      total: jobList.length,
      jobs: jobList.map((job): JobInfo => {
        return {
          jobId: job.jobId,
          position: job.position,
          skills: job.skills,
          country: job.country,
          region: job.region,
          dueDate: job.dueDate,
          companyId: job.companyId,
          companyName: job.company.companyName,
        };
      }),
    };
  }
}
