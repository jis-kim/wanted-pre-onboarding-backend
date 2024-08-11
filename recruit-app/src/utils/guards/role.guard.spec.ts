import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';
import { UsersService } from '../../users/users.service';
import { CompaniesService } from '../../companies/companies.service';
import { Role } from '../decorator/allowed-for.decorator';
import { mock } from 'node:test';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;
  let usersService: UsersService;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
    usersService = module.get<UsersService>(UsersService);
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockHttpArgumentsHost: any;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        headers: {},
      };

      mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
      };

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue(mockHttpArgumentsHost),
        getHandler: jest.fn(),
      } as any;
    });

    it('role 이 없을 때 true', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);
      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('role 이 USER 면서 userId가 db에 존재하면 true', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.USER);

      const httpContext = mockExecutionContext.switchToHttp();
      mockExecutionContext.switchToHttp().getRequest().headers['x-user-id'] =
        'validUserId';
      jest
        .spyOn(usersService, 'findOneById')
        .mockResolvedValue({ userId: 'validUserId' } as any);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(usersService.findOneById).toHaveBeenCalledWith('validUserId');
    });

    it('role 이 USER 면서 x-user-id가 없을 때 false', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.USER);
      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
      expect(usersService.findOneById).not.toHaveBeenCalled();
    });

    it('role 이 USER 면서 userId가 db에 없으면 false', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.USER);
      mockExecutionContext.switchToHttp().getRequest().headers['x-user-id'] =
        'invalidUserId';
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(null);
      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
      expect(usersService.findOneById).toHaveBeenCalledWith('invalidUserId');
    });

    it('role 이 COMPANY 면서 companyId가 db에 존재하면 true', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.COMPANY);
      mockExecutionContext.switchToHttp().getRequest().headers['x-company-id'] =
        'validCompanyId';
      jest
        .spyOn(companiesService, 'findOneById')
        .mockResolvedValue({ id: 'validCompanyId' } as any);
      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(companiesService.findOneById).toHaveBeenCalledWith(
        'validCompanyId',
      );
    });

    it('role 이 COMPANY 면서 x-company-id가 없을 때 false', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.COMPANY);
      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
      expect(companiesService.findOneById).not.toHaveBeenCalled();
    });

    it('role 이 COMPANY 면서 companyId가 db에 없으면 false', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.COMPANY);
      mockExecutionContext.switchToHttp().getRequest().headers['x-company-id'] =
        'invalidCompanyId';
      jest.spyOn(companiesService, 'findOneById').mockResolvedValue(null);
      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
      expect(companiesService.findOneById).toHaveBeenCalledWith(
        'invalidCompanyId',
      );
    });

    it('x-user-id가 Array 이면 BadRequestException', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.USER);
      mockExecutionContext.switchToHttp().getRequest().headers['x-user-id'] = [
        'userId1',
        'userId2',
      ];

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('x-company-id가 Array 이면 BadRequestException', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(Role.COMPANY);
      mockExecutionContext.switchToHttp().getRequest().headers['x-company-id'] =
        ['companyId1', 'companyId2'];

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
