import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JobsService } from './jobs.service';
import { Job } from '../entities';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { nanoid } from 'nanoid';
import { JobDetailDto } from './dto/job-detail.dto';

jest.mock('nanoid');

describe('JobsService', () => {
  let service: JobsService;
  let repository: Repository<Job>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get(JobsService);
    repository = module.get(getRepositoryToken(Job));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('job을 생성하고 jobId 를 return 한다.', async () => {
      const createJobDto: CreateJobDto = {
        position: '개발',
        skills: 'JavaScript',
        country: '한국',
        region: '서울',
        dueDate: new Date(),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
        reward: 123,
        description: '',
      };
      const jobId = 'testJobId';
      (nanoid as jest.Mock).mockReturnValue(jobId);
      jest
        .spyOn(repository, 'insert')
        .mockResolvedValue({ identifiers: jobId } as any);

      const result = await service.create(createJobDto);

      expect(result).toBe(jobId);
      expect(repository.insert).toHaveBeenCalledWith({
        jobId,
        ...createJobDto,
      });
    });
  });

  describe('findByKeyword', () => {
    it('keyword 로 검색된 job list 를 리턴한다.', async () => {
      const keyword = '개발';
      const jobList = [
        {
          jobId: '1',
          position: '개발',
          skills: 'python',
          country: '한국',
          region: '서울',
          dueDate: new Date(),
          companyId: 'aaaaaaaaaaaaaaaaaaaaa',
        },
      ] as Job[];
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(jobList),
      } as any);

      const result = await service.findByKeyword(keyword);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('job');
      expect(result).toBe(jobList);
    });
  });

  describe('findAll', () => {
    it('모든 job을 return 한다.', async () => {
      const jobList = [
        {
          jobId: '1',
          position: '개발',
          skills: 'python',
          country: '한국',
          region: '서울',
          dueDate: new Date(),
          companyId: 'aaaaaaaaaaaaaaaaaaaaa',
        },
      ] as Job[];
      jest.spyOn(repository, 'find').mockResolvedValue(jobList);

      const result = await service.findAll();

      expect(result).toBe(jobList);
    });
  });

  describe('findOne', () => {
    it('job detail 을 return 한다.', async () => {
      const jobId = '1';
      const detailedJob: JobDetailDto = {
        jobId: '1',
        position: '개발',
        skills: 'python',
        country: '한국',
        region: '서울',
        dueDate: new Date(),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
        reward: 0,
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          companyId: 'aaaaaaaaaaaaaaaaaaaaa',
          companyName: 'companyName',
          jobs: [],
        },
      };
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(detailedJob),
      } as any);

      const result = await service.findOne(jobId);

      expect(result).toBe(detailedJob);
    });

    it('jobId 가 유효하지 않은 경우 NotFoundException', async () => {
      const jobId = '1';
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne(jobId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('job 을 update 하고 update 된 job을 리턴한다.', async () => {
      const jobId = '1';
      const updateJobDto: UpdateJobDto = {
        dueDate: new Date('2024-12-31'),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
      };

      const job = {
        jobId: '1',
        position: '개발',
        skills: 'python',
        country: '한국',
        region: '서울',
        dueDate: new Date(),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
      } as Job;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(job);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined as any);

      const result = await service.update(jobId, updateJobDto);

      expect(repository.update).toHaveBeenCalledWith(jobId, updateJobDto);
      expect(result).toEqual({ ...job, ...updateJobDto });
    });

    it('jobId 가 유효하지 않을 경우 NotFoundException', async () => {
      const jobId = '1';
      const updateJobDto: UpdateJobDto = {
        position: 'abc',
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(jobId, updateJobDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('job을 생성한 회사의 id가 아니면 ForbiddenException', async () => {
      const jobId = '1';
      const updateJobDto: UpdateJobDto = {
        position: 'abc',
        companyId: 'bbbbbbbbbbbbbbbbbbbbb',
      };
      const job = {
        jobId: '1',
        position: '개발',
        skills: 'python',
        country: '한국',
        region: '서울',
        dueDate: new Date(),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
      } as Job;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(job);

      await expect(service.update(jobId, updateJobDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('jobId 로 job 삭제', async () => {
      const jobId = '1';
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.remove(jobId)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(jobId);
    });

    it('jobId 가 유효하지 않으면 NotFoundException', async () => {
      const jobId = '1';
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(jobId)).rejects.toThrow(NotFoundException);
    });
  });
});
