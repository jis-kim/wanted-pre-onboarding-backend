import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application, User } from '../entities';
import { InsertResult, Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: {
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    repository = module.get(getRepositoryToken(Application));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const user = {
    userId: 'user123',
  } as User;

  describe('create', () => {
    const createApplicationDto: CreateApplicationDto = {
      jobId: 'job123',
      title: 'Application Title',
      content: 'Application Content',
    };

    it('application 생성 성공', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'insert').mockResolvedValue(new InsertResult());

      const result = await service.create(user, createApplicationDto);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          jobId: createApplicationDto.jobId,
          userId: user.userId,
        },
      });
      expect(repository.insert).toHaveBeenCalled();
    });

    it('이미 지원한 채용공고인 경우 ConflictException', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({} as Application);

      await expect(service.create(user, createApplicationDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          jobId: createApplicationDto.jobId,
          userId: user.userId,
        },
      });
      expect(repository.insert).not.toHaveBeenCalled();
    });

    it('jobId 가 유효하지 않은 경우 NotFoundException', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'insert').mockRejectedValue({ code: '23503' });

      await expect(service.create(user, createApplicationDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.insert).toHaveBeenCalled();
    });
  });
});
