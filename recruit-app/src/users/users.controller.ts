import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 유저 생성 확인용 전체 조회 api
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
