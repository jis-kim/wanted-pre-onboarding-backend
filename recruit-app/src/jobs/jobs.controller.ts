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
import { Response } from 'express';
import { CreateJobDto } from './dto/create-job.dto';
import { JobListDto } from './dto/job-list.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';
import { JobDetailDto } from './dto/job-detail.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Get()
  async findAll(): Promise<JobListDto> {
    const jobList = await this.jobService.findAll();
    return this.jobService.formatJobList(jobList);
  }

  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @Res() res: Response,
  ): Promise<void> {
    const jobId = await this.jobService.create(createJobDto);
    const location = `/jobs/${jobId}`;
    res.setHeader('Location', location);
    res.status(HttpStatus.CREATED).send({
      message: 'Job created.',
      jobId,
    });
  }

  @Get(':jobId')
  findOne(@Param('jobId') jobId: string): Promise<JobDetailDto> {
    return this.jobService.findOne(jobId);
  }

  @Patch(':jobId')
  async update(
    @Param('jobId') jobId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    const job = await this.jobService.update(jobId, updateJobDto);
    return {
      message: 'Job updated.',
      job,
    };
  }

  @Delete(':jobId')
  async remove(@Param('jobId') jobId: string) {
    await this.jobService.remove(jobId);
    return {
      message: 'Job deleted.',
    };
  }
}
