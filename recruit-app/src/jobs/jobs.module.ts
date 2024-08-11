import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../entities';
import { RoleGuard } from '../utils/guards/role.guard';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), UsersModule, CompaniesModule],
  controllers: [JobsController],
  providers: [JobsService, RoleGuard],
})
export class JobsModule {}
