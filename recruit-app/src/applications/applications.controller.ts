import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '../entities';
import { AllowedFor, Role } from '../utils/decorator/allowed-for.decorator';
import { RequestUser } from '../utils/decorator/request-user.decorator';
import { RoleGuard } from '../utils/guards/role.guard';
import { ApplicationsService } from './applications.service';
import { ApplicationListDto } from './dto/application-list.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

const APPLICATION_PATH = '/applications';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @AllowedFor(Role.USER)
  @UseGuards(RoleGuard)
  @Get()
  async findAll(@RequestUser() user: User): Promise<ApplicationListDto> {
    return this.applicationsService.findAll(user);
  }

  @AllowedFor(Role.USER)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Res() res: Response,
    @RequestUser() user: User,
  ) {
    const applicationId = await this.applicationsService.create(
      user,
      createApplicationDto,
    );
    const location = `${APPLICATION_PATH}/${applicationId}`;
    res.setHeader('Location', location);
    res.status(HttpStatus.CREATED).send({
      message: 'Application created.',
      applicationId,
    });
  }
}
