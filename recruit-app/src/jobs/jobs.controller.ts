import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';
import { Response } from 'express';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @Res() res: Response,
  ): Promise<void> {
    const location = `/jobs/${await this.jobService.create(createJobDto)}`;
    res.setHeader('Location', location);
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':jobId')
  findOne(@Param('jobId') jobId: string) {
    return this.jobService.findOne(jobId);
  }

  @Patch(':jobId')
  update(@Param('jobId') jobId: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(jobId, updateJobDto);
  }

  @Delete(':jobId')
  remove(@Param('jobId') jobId: string) {
    return this.jobService.remove(jobId);
  }
}
