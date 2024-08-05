import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobDetailDto } from './dto/job-detail.dto';
import { Response } from 'express';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Job } from '../entities';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            findAll: jest.fn(),
            findByKeyword: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            formatJobList: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('모든 job list response ', async () => {
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
      jest.spyOn(service, 'findAll').mockResolvedValue(jobList);
      jest.spyOn(service, 'formatJobList').mockReturnValue(jobList as any);

      const result = await controller.findAll();

      expect(result).toBe(jobList);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.formatJobList).toHaveBeenCalledWith(jobList);
    });

    it('keyword가 있을 때 해당하는 job list response', async () => {
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
      jest.spyOn(service, 'findByKeyword').mockResolvedValue(jobList);
      jest.spyOn(service, 'formatJobList').mockReturnValue(jobList as any);

      const result = await controller.findAll(keyword);

      expect(result).toBe(jobList);
      expect(service.findByKeyword).toHaveBeenCalledWith(keyword);
      expect(service.formatJobList).toHaveBeenCalledWith(jobList);
    });
  });

  describe('create', () => {
    it('job 생성 후 201 Created, Location header response', async () => {
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
      const jobId = 'aaaaaaaaaaaaaaaaaaaaa';
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      jest.spyOn(service, 'create').mockResolvedValue(jobId);

      await controller.create(createJobDto, res);

      expect(service.create).toHaveBeenCalledWith(createJobDto);
      expect(res.setHeader).toHaveBeenCalledWith('Location', `/jobs/${jobId}`);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Job created.',
        jobId,
      });
    });

    it('job 생성 실패 시 400 Bad Request response', async () => {
      const createJobDto: CreateJobDto = {
        position: '',
        skills: 'JavaScript',
        country: '',
        region: '서울',
        dueDate: new Date(),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
        reward: 1000000000,
        description: '',
      };

      const validator = new ValidationPipe();
      await expect(
        validator.transform(createJobDto, {
          type: 'body',
          metatype: CreateJobDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('jobId에 해당하는 job 상세 정보를 response', async () => {
      const jobId = '1';
      const jobDetail: JobDetailDto = {
        jobId: '1',
        position: '개발',
        skills: 'python',
        country: '한국',
        region: '서울',
        dueDate: new Date(),
        companyId: 'aaaaaaaaaaaaaaaaaaaaa',
        createdAt: new Date(),
        updatedAt: new Date(),
        reward: 0,
        description: '',
        company: {
          companyId: '',
          companyName: '',
          jobs: [],
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(jobDetail);

      const result = await controller.findOne(jobId);

      expect(result).toBe(jobDetail);
      expect(service.findOne).toHaveBeenCalledWith(jobId);
    });
  });

  describe('update', () => {
    it('jobId 로 update 후 update 된 job response', async () => {
      const jobId = '1';
      const updateJobDto: UpdateJobDto = {
        position: 'Senior Developer',
        companyId: 'companyId',
      };
      const updatedJob = { jobId, ...updateJobDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedJob as Job);

      const result = await controller.update(jobId, updateJobDto);

      expect(result).toEqual({
        message: 'Job updated.',
        job: updatedJob,
      });
      expect(service.update).toHaveBeenCalledWith(jobId, updateJobDto);
    });
  });

  describe('remove', () => {
    it('jobId 로 받은 Job 삭제', async () => {
      const jobId = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(jobId);

      expect(result).toEqual({
        message: 'Job deleted.',
      });
      expect(service.remove).toHaveBeenCalledWith(jobId);
    });
  });
});
