import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Response } from 'express';
import { ApplicationListDto } from './dto/application-list.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Res() res: Response,
  ) {
    const applicationId =
      await this.applicationsService.create(createApplicationDto);
    const location = `/applications/${applicationId}`;
    res.setHeader('Location', location);
    res.status(HttpStatus.CREATED).send({
      message: 'Application created.',
      applicationId,
    });
  }

  @Get()
  async findAll(): Promise<ApplicationListDto> {
    // 임시 사용자 id
    const userId = 'FP7nRguP4oP6mFxAEid-n';
    return this.applicationsService.findAll(userId);
  }
}
