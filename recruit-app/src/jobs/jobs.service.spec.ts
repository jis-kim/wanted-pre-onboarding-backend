import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';

const mockDB = {
  find: jest.fn(),
};

describe('JobService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: 'JOB_REPOSITORY',
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of jobs', async () => {
      mockDB.find.mockResolvedValue(['samsung', 'lg', 'hyundai']);
      const jobs = service.find();

      expect(mockDB.find).toHaveBeenCalledTimes(1);
    });
  });
});
