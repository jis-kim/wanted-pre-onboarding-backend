import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { Application, User } from '../entities';
import { Repository } from 'typeorm';
import { ApplicationListDto } from './dto/application-list.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(user: User, createApplicationDto: CreateApplicationDto) {
    const applicationId = nanoid();
    const { jobId } = createApplicationDto;
    const application = await this.applicationRepository.findOne({
      where: { jobId, userId: user.userId },
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

  async findAll(user: User): Promise<ApplicationListDto> {
    const applicationList = await this.applicationRepository.find({
      select: {
        applicationId: true,
        userId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        job: {
          jobId: true,
          position: true,
        },
      },
      where: { userId: user.userId },
      relations: ['job'],
    });

    return {
      total: applicationList.length,
      applications: applicationList,
    };
  }
}
