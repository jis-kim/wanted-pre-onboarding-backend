import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDetailDto } from './dto/job-detail.dto';
import { JobListDto } from './dto/job-list.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';
import { KeywordPipe } from './pipe/keyword.pipe';
import { AllowedFor, Role } from '../utils/decorator/allowed-for.decorator';
import { RoleGuard } from '../utils/guards/role.guard';
import { Company, Job } from '../entities';
import { RequestCompany } from '../utils/decorator/company.decorator';

const JOB_PATH = '/jobs';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Get()
  async findAll(
    @Query('keyword', KeywordPipe) keyword?: string,
  ): Promise<JobListDto> {
    let jobList;
    if (keyword) {
      jobList = await this.jobService.findByKeyword(keyword);
    } else {
      jobList = await this.jobService.findAll();
    }
    return this.jobService.formatJobList(jobList);
  }

  @AllowedFor(Role.COMPANY)
  @UseGuards(RoleGuard)
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @Res() res: Response,
    @RequestCompany() company: Company,
  ): Promise<void> {
    const jobId = await this.jobService.create(company, createJobDto);
    const location = `${JOB_PATH}/${jobId}`;
    res.setHeader('Location', location);
    res.status(HttpStatus.CREATED).send({
      message: 'Job created.',
      jobId,
    });
  }

  @Get(':jobId')
  findOne(@Param('jobId') jobId: string): Promise<JobDetailDto> {
    return this.jobService.findDetailedOne(jobId);
  }

  @AllowedFor(Role.COMPANY)
  @UseGuards(RoleGuard)
  @Patch(':jobId')
  async update(
    @Param('jobId') jobId: string,
    @Body() updateJobDto: UpdateJobDto,
    @RequestCompany() company: Company,
  ) {
    const job: Job = await this.jobService.update(jobId, company, updateJobDto);
    return {
      message: 'Job updated.',
      job,
    };
  }

  @AllowedFor(Role.COMPANY)
  @UseGuards(RoleGuard)
  @Delete(':jobId')
  async remove(
    @Param('jobId') jobId: string,
    @RequestCompany() company: Company,
  ) {
    await this.jobService.remove(jobId, company);
    return {
      message: 'Job deleted.',
    };
  }
}
