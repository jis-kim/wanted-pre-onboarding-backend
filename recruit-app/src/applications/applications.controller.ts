import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Response } from 'express';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Res() res: Response,
  ) {
    const applicationId = this.applicationsService.create(createApplicationDto);
    const location = `/applications/${applicationId}`;
    res.setHeader('Location', location);
    res.status(201).send({
      message: 'Application created.',
      applicationId,
    });
  }
}
