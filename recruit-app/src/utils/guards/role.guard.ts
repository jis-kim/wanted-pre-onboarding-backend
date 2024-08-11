import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { CompaniesService } from '../../companies/companies.service';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorator/allowed-for.decorator';

/**
 * 로그인 역할을 대체해서 company 또는 user 역할을 가진 사용자만 허용하는 가드
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const role = this.reflector.get<Role>('role', context.getHandler());

    switch (role) {
      case Role.USER:
        return this.handleUserRole(req);
      case Role.COMPANY:
        return this.handleCompanyRole(req);
      default:
        return true;
    }
  }

  private async handleUserRole(req: any): Promise<boolean> {
    const userId = this.getHeaderValue(req.headers['x-user-id']);
    if (!userId) {
      return false;
    }
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      return false;
    }
    req.user = user;
    return true;
  }

  private async handleCompanyRole(req: any): Promise<boolean> {
    const companyId = this.getHeaderValue(req.headers['x-company-id']);
    if (!companyId) {
      return false;
    }
    const company = await this.companiesService.findOneById(companyId);
    if (!company) {
      return false;
    }
    req.company = company;
    return true;
  }

  private getHeaderValue(
    value: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      throw new BadRequestException('헤더 값은 단일 문자열이어야 합니다.');
    }
    return value;
  }
}
