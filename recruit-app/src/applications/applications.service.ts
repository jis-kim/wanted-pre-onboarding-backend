import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createApplicationDto: CreateApplicationDto) {
    const applicationId = nanoid();
    const { jobId, userId } = createApplicationDto;
    const application = await this.applicationRepository.findOne({
      where: { jobId, userId },
    });

    if (application) {
      throw new ConflictException('이미 지원한 채용공고입니다.');
    }

    try {
      await this.applicationRepository.insert({
        ...createApplicationDto,
        applicationId,
      });
    } catch (error) {
      if (error.code === '23503') {
        // foreign key constraint error
        throw new NotFoundException('존재하지 않는 채용공고입니다.');
      }
      throw error;
    }
    return applicationId;
  }
}
