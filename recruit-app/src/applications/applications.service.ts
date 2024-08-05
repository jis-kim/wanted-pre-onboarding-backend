import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  create(createApplicationDto: CreateApplicationDto) {
    const applicationId = nanoid();
    this.applicationRepository.create({
      ...createApplicationDto,
      applicationId,
    });
    return applicationId;
  }
}
