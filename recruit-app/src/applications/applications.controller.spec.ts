import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('create', () => {
    it('요청 성공 시 201 Created. Location 헤더를 함께 보낸다.', async () => {
      const dto: CreateApplicationDto = {
        jobId: '123456789012345678901', // 21자
        userId: '123456789012345678901',
        title: 'Test Application',
        content: 'This is a test application content.',
      };
      const mockApplicationId = 'mockApplicationId123';
      const mockResponse = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockApplicationId);

      await controller.create(dto, mockResponse as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Location',
        `/applications/${mockApplicationId}`,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Application created.',
        applicationId: mockApplicationId,
      });
    });

    it('잘못된 request 형식일 경우 400 Bad Request Error.', async () => {
      const invalidDto = {
        jobId: 'invalid', // Too short
        userId: '123456789012345678901',
        content: 'Valid content',
      };

      const validator = new ValidationPipe();
      await expect(
        validator.transform(invalidDto, {
          type: 'body',
          metatype: CreateApplicationDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
